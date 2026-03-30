"""Main FastAPI application for BarrelHub backend."""

import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .routers import auth, barrels, registry, sensory, rfq, admin

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info(
        "application_starting",
        app_name=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
    )
    yield
    # Shutdown
    logger.info("application_shutting_down")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="BarrelHub - Bulk Whiskey & Spirits B2B Marketplace API",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    openapi_url="/openapi.json" if settings.is_development else None,
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """Add request logging with timing."""
    start_time = time.time()
    
    # Log request
    logger.debug(
        "request_started",
        method=request.method,
        path=request.url.path,
        query=str(request.query_params),
        client=request.client.host if request.client else None,
    )
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            "request_completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=round(process_time * 1000, 2),
        )
        
        # Add timing header
        response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
        return response
        
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            "request_failed",
            method=request.method,
            path=request.url.path,
            error=str(e),
            duration_ms=round(process_time * 1000, 2),
        )
        raise


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unhandled exceptions."""
    logger.error(
        "unhandled_exception",
        error=str(exc),
        path=request.url.path,
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.app_version,
        "environment": settings.environment,
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "documentation": "/docs" if settings.is_development else None,
        "health": "/health",
    }


# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(barrels.router, prefix="/api/v1/barrels", tags=["Barrels"])
app.include_router(registry.router, prefix="/api/v1/registry", tags=["Registry"])
app.include_router(sensory.router, prefix="/api/v1/sensory", tags=["Sensory Profiles"])
app.include_router(rfq.router, prefix="/api/v1/rfq", tags=["RFQ"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])


def main():
    """Run the application with uvicorn."""
    import uvicorn
    
    uvicorn.run(
        "barrelhub_backend.main:app",
        host=settings.host,
        port=settings.port,
        workers=settings.workers if settings.is_production else 1,
        reload=settings.is_development,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    main()
