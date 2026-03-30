"""
LabSource Backend - FastAPI Application
Laboratory & Life Sciences B2B Marketplace
"""

import logging
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .routers import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Initialize Sentry in production
if settings.sentry_dsn and settings.is_production:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")
    
    # TODO: Initialize database connections, Redis, etc.
    
    yield
    
    # Shutdown
    logger.info("Shutting down application")
    
    # TODO: Close database connections, cleanup resources


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    LabSource API - Laboratory & Life Sciences B2B Marketplace
    
    ## Features
    
    - **Lot-tracked delivery** with CoA before shipping
    - **Cold chain monitoring** with real-time temperature tracking
    - **Grant procurement compliance** for NSF/NIH funding
    - **Substitute recommendations** for backorders
    - **CLIA-waived product tracking** for clinical labs
    
    ## Authentication
    
    All API endpoints (except login/register) require a Bearer token in the Authorization header:
    ```
    Authorization: Bearer <your-access-token>
    ```
    """,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    openapi_url="/openapi.json" if settings.is_development else None,
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include API routers
app.include_router(api_router)
app.include_router(payments_router, prefix="/payments", tags=["payments"])



@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API information."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "docs": "/docs" if settings.is_development else None,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": "2024-01-15T00:00:00Z",
        "version": settings.app_version,
    }


@app.get("/ready", tags=["Health"])
async def readiness_check():
    """Readiness check for Kubernetes."""
    # TODO: Check database connectivity, external services
    return {
        "status": "ready",
        "checks": {
            "database": "ok",
            "baserow": "ok",
            "saleor": "ok",
        },
    }


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unhandled exceptions."""
    logger.exception("Unhandled exception")
    
    if settings.is_production:
        # Don't expose internal errors in production
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An internal error occurred",
                },
            },
        )
    else:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": str(exc),
                },
            },
        )


# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    logger.info("Application startup complete")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    logger.info("Application shutdown complete")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "labsource_backend.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.is_development,
        workers=settings.workers if settings.is_production else 1,
    )
