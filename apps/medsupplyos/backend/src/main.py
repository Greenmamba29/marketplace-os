"""Main FastAPI application for MedSupplyOS."""

import time
from contextlib import asynccontextmanager

import sentry_sdk
import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response

from .config import get_settings
from .routers import auth, equipment, rfq, quotes, orders, gpo, admin
from src.routers.payments import router as payments_router

logger = structlog.get_logger()

# Prometheus metrics
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status"]
)
REQUEST_DURATION = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration",
    ["method", "endpoint"]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    settings = get_settings()
    
    # Startup
    logger.info(
        "starting_application",
        app_name=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
    )
    
    # Initialize Sentry if configured
    if settings.sentry_dsn:
        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            environment=settings.environment,
            traces_sample_rate=0.1 if settings.is_production else 1.0,
        )
    
    yield
    
    # Shutdown
    logger.info("shutting_down_application")


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Healthcare Equipment & MRO Marketplace API with UDI Compliance",
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        openapi_url="/openapi.json" if settings.is_development else None,
        lifespan=lifespan,
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )
    
    # Request logging and metrics middleware
    @app.middleware("http")
    async def logging_middleware(request: Request, call_next):
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log request
        logger.info(
            "http_request",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=round(duration * 1000, 2),
            client_ip=request.client.host if request.client else None,
        )
        
        # Record metrics
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code
        ).inc()
        REQUEST_DURATION.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(duration)
        
        return response
    
    # Exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
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
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred",
                }
            }
        )
    
    # Health check endpoint
    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "version": settings.app_version,
            "environment": settings.environment,
        }
    
    # Metrics endpoint
    @app.get("/metrics")
    async def metrics():
        if settings.prometheus_enabled:
            return Response(
                content=generate_latest(),
                media_type=CONTENT_TYPE_LATEST
            )
        return Response(status_code=404)
    
    # Include routers
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
    app.include_router(equipment.router, prefix="/api/v1/equipment", tags=["Equipment"])
    app.include_router(rfq.router, prefix="/api/v1/rfq", tags=["RFQ"])
    app.include_router(quotes.router, prefix="/api/v1/quotes", tags=["Quotes"])
    app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
    app.include_router(gpo.router, prefix="/api/v1/gpo", tags=["GPO"])
    app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
    
    return app


app = create_app()


def main():
    """Run the application with uvicorn."""
    import uvicorn
    
    settings = get_settings()
    uvicorn.run(
        "medsupplyos_backend.main:app",
        host=settings.host,
        port=settings.port,
        workers=settings.workers if settings.is_production else 1,
        reload=settings.is_development,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    main()
_main__":
    main()
