"""
GovSource Backend - FastAPI Application
Government Procurement Marketplace API
"""

from contextlib import asynccontextmanager
import structlog

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .services.baserow import get_baserow_service
from .services.samgov import get_samgov_service
from .routers import (
    auth_router,
    vendors_router,
    rfps_router,
    compliance_router,
    admin_router,
    payments_router,
)
from .routers.rfqs import router as rfqs_router

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting GovSource API")
    settings = get_settings()
    
    logger.info(
        "Configuration loaded",
        app_name=settings.app_name,
        debug=settings.debug,
        baserow_url=settings.baserow_url,
    )
    
    yield
    
    # Shutdown
    logger.info("Shutting down GovSource API")
    
    # Close service connections
    baserow = get_baserow_service()
    await baserow.close()
    
    samgov = get_samgov_service()
    await samgov.close()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Government Procurement Marketplace API",
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
        lifespan=lifespan,
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(
            "Unhandled exception",
            error=str(exc),
            path=request.url.path,
        )
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An internal error occurred",
                }
            }
        )
    
    # Include routers
    app.include_router(auth_router, prefix="/api")
    app.include_router(vendors_router, prefix="/api")
    app.include_router(rfps_router, prefix="/api")
    app.include_router(rfqs_router, prefix="/api")
    app.include_router(compliance_router, prefix="/api")
    app.include_router(admin_router, prefix="/api")
    
    return app


# Create the application instance
app = create_app()


@app.get("/")
async def root():
    """Root endpoint."""
    settings = get_settings()
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "docs": "/docs" if settings.debug else None,
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "services": {
            "api": "up",
            "baserow": "unknown",  # Would check actual connection
            "samgov": "unknown",
        }
    }


@app.get("/api")
async def api_info():
    """API information endpoint."""
    return {
        "name": "GovSource API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth",
            "vendors": "/api/vendors",
            "rfps": "/api/rfps",
            "rfqs": "/api/rfqs",
            "compliance": "/api/compliance",
            "admin": "/api/admin",
        }
    }


def main():
    """Main entry point for running the application."""
    import uvicorn
    
    settings = get_settings()
    
    uvicorn.run(
        "src.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    main()
_level.lower(),
    )


if __name__ == "__main__":
    main()
