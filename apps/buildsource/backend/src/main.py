"""BuildSource API - Main application entry point."""

import logging
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from routers import (
    auth_router,
    materials_router,
    projects_router,
    rfq_router,
    quotes_router,
    orders_router,
    admin_router,
    leed_router,
    accio_router,
)
from src.routers.payments import router as payments_router


# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize Sentry in production
if settings.SENTRY_DSN and settings.is_production:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Construction Materials Marketplace API",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unhandled exceptions."""
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "message": str(exc) if settings.is_development else "An unexpected error occurred",
        },
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# API version endpoint
@app.get("/version", tags=["Health"])
async def version():
    """Get API version information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(materials_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(rfq_router, prefix="/api/v1")
app.include_router(quotes_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(leed_router, prefix="/api/v1")
app.include_router(accio_router, prefix="/api/v1")


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "documentation": "/docs" if settings.is_development else None,
        "health": "/health",
    }


def main():
    """Main entry point for running the application."""
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        workers=settings.WORKERS if not settings.is_development else 1,
        reload=settings.is_development,
        log_level="info" if settings.is_production else "debug",
    )


if __name__ == "__main__":
    main()
__":
    main()
