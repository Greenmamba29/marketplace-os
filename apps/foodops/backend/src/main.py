"""FoodOps API - Main application entry point."""

import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from .config import settings
from .routers import auth, ingredients, menu, rfq, quotes, orders, admin


# Request ID middleware
async def add_request_id(request: Request, call_next):
    """Add unique request ID to each request."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# Exception handler
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions."""
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
            },
            "meta": {
                "timestamp": "2024-01-01T00:00:00Z",
                "request_id": request_id,
            },
        },
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"📍 Environment: {settings.ENVIRONMENT}")
    print(f"🔧 Debug mode: {settings.DEBUG}")
    
    # Initialize services
    # TODO: Initialize database, Redis, etc.
    
    yield
    
    # Shutdown
    print("👋 Shutting down...")
    # TODO: Cleanup resources


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Commercial Food Distribution Platform API",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    openapi_url="/openapi.json" if settings.is_development else None,
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

# Add custom middleware
app.middleware("http")(add_request_id)

# Add exception handlers
app.add_exception_handler(Exception, global_exception_handler)


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# API status endpoint
@app.get("/api/v1/status", tags=["Status"])
async def api_status():
    """API status endpoint."""
    return {
        "success": True,
        "data": {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
            "features": {
                "fsma_compliance": settings.FSMA_TRACEABILITY_ENABLED,
                "cold_chain_monitoring": True,
                "ai_forecasting": True,
            },
        },
    }


# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(ingredients.router, prefix="/api/v1/ingredients", tags=["Ingredients"])
app.include_router(menu.router, prefix="/api/v1/menu", tags=["Menu Engineering"])
app.include_router(rfq.router, prefix="/api/v1/rfq", tags=["RFQ"])
app.include_router(quotes.router, prefix="/api/v1/quotes", tags=["Quotes"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(payments_router, prefix="/payments", tags=["payments"])



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
        "foodops_backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        workers=settings.WORKERS if not settings.DEBUG else 1,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )


if __name__ == "__main__":
    main()
