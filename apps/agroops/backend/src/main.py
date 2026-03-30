"""AgroOps API - Agricultural Inputs Marketplace Backend."""

import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from src.config import get_settings
from src.routers import (
    auth_router,
    inputs_router,
    agronomy_router,
    rfq_router,
    quotes_router,
    admin_router,
)
from src.routers.payments import router as payments_router


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting AgroOps API...")
    settings = get_settings()
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AgroOps API...")


def create_application() -> FastAPI:
    """Create and configure FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
        AgroOps API - Agricultural Inputs Marketplace
        
        ## Features
        
        - **Input Directory**: Browse and search agricultural inputs
        - **Agronomic Engine**: AI-powered input recommendations
        - **RFQ Platform**: Request quotes from multiple suppliers
        - **EPA Compliance**: Verify state-by-state registration
        - **Market Intelligence**: Seasonal forecasts and pricing
        
        ## Authentication
        
        Most endpoints require authentication via Bearer token.
        Use `/api/v1/auth/login` to obtain tokens.
        """,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
    )
    
    # Add middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # Include routers
    app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
    app.include_router(inputs_router, prefix="/api/v1/inputs", tags=["Inputs"])
    app.include_router(agronomy_router, prefix="/api/v1/agronomy", tags=["Agronomy"])
    app.include_router(rfq_router, prefix="/api/v1/rfq", tags=["RFQ"])
    app.include_router(quotes_router, prefix="/api/v1/quotes", tags=["Quotes"])
    app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])
    
    # Health check endpoint
    @app.get("/health", tags=["Health"])
    async def health_check():
        """Health check endpoint."""
        return {
            "status": "healthy",
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        }
    
    # Root endpoint
    @app.get("/", tags=["Root"])
    async def root():
        """Root endpoint."""
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "documentation": "/docs" if settings.DEBUG else None,
        }
    
    # Exception handlers
    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        """Global exception handler."""
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error",
                "message": str(exc) if settings.DEBUG else "An unexpected error occurred",
            },
        )
    
    return app


# Create application instance
app = create_application()


if __name__ == "__main__":
    settings = get_settings()
    uvicorn.run(
        "src.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
EVEL.lower(),
    )
