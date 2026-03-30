"""CareOps Backend API - Main Application Entry Point."""

import logging
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .routers import auth, caregivers, careplans, scheduling, admin

# Configure logging
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
        structlog.processors.JSONRenderer() if get_settings().log_format == "json" else structlog.dev.ConsoleRenderer(),
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
    settings = get_settings()
    logger.info(
        "starting_careops_api",
        app_name=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
    )
    yield
    logger.info("shutting_down_careops_api")


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="CareOps - Home Care & Staffing Marketplace API",
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        openapi_url="/openapi.json" if settings.is_development else None,
        lifespan=lifespan,
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    # Include routers
    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(caregivers.router, prefix="/api/caregivers", tags=["Caregivers"])
    app.include_router(careplans.router, prefix="/api/care-plans", tags=["Care Plans"])
    app.include_router(scheduling.router, prefix="/api/schedules", tags=["Scheduling"])
    app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
    app.include_router(payments.router, prefix="/api/payments", tags=["payments"])

    return app


app = create_application()


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unhandled exceptions."""
    logger.error(
        "unhandled_exception",
        error=str(exc),
        path=request.url.path,
        method=request.method,
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred",
            "error": str(exc) if get_settings().is_development else "Internal server error",
        },
    )


@app.get("/")
async def root():
    """Root endpoint - API health check."""
    settings = get_settings()
    return {
        "success": True,
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "environment": settings.environment,
        "docs": "/docs" if settings.is_development else None,
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "success": True,
        "status": "healthy",
        "service": "careops-api",
    }


@app.get("/api/health/detailed")
async def detailed_health_check():
    """Detailed health check with dependencies."""
    from .services.baserow import BaserowService

    health_status = {
        "success": True,
        "status": "healthy",
        "service": "careops-api",
        "dependencies": {},
    }

    # Check Baserow connection
    try:
        baserow = BaserowService()
        await baserow.health_check()
        health_status["dependencies"]["baserow"] = {"status": "healthy"}
    except Exception as e:
        health_status["dependencies"]["baserow"] = {"status": "unhealthy", "error": str(e)}
        health_status["status"] = "degraded"

    return health_status


def main():
    """Main entry point for running the application."""
    import uvicorn

    settings = get_settings()
    uvicorn.run(
        "careops_backend.main:app",
        host=settings.host,
        port=settings.port,
        workers=settings.workers if not settings.is_development else 1,
        reload=settings.is_development,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    main()
