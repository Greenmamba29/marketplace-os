"""
IngredientOS FastAPI Application
Specialty Food & Beverage Ingredients Marketplace Backend
"""

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.requests import Request

from .config import get_settings
from .routers import auth, ingredients, regulatory, rfq, admin, payments

# Initialize Sentry in production
settings = get_settings()
if settings.sentry_dsn and settings.is_production:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    IngredientOS API - The premier B2B marketplace for specialty food and beverage ingredients.
    
    ## Features
    
    * **Ingredient Directory** - Browse verified ingredients with complete regulatory documentation
    * **GRAS Verification** - FDA GRAS status tracking and verification
    * **Certification Management** - Organic, Non-GMO, Kosher, Halal certification tracking
    * **Allergen Management** - FALCPA-compliant allergen declarations
    * **RFQ System** - Request for quote with compliance requirements
    * **Order Management** - End-to-end order tracking with documentation
    
    ## Compliance
    
    * FDA GRAS Database Integration
    * USDA Organic Certification Verification
    * Non-GMO Project Verification
    * FALCPA Allergen Compliance
    * FSMA Food Defense Documentation
    """,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    openapi_url="/openapi.json" if settings.is_development else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unhandled exceptions"""
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
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.app_version,
        "environment": settings.environment,
    }


# API version prefix
api_prefix = "/api/v1"

# Include routers
app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["Authentication"])
app.include_router(ingredients.router, prefix=f"{api_prefix}/ingredients", tags=["Ingredients"])
app.include_router(regulatory.router, prefix=f"{api_prefix}/regulatory", tags=["Regulatory"])
app.include_router(rfq.router, prefix=f"{api_prefix}/rfq", tags=["RFQ"])
app.include_router(admin.router, prefix=f"{api_prefix}/admin", tags=["Admin"])


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "documentation": "/docs" if settings.is_development else None,
        "health": "/health",
    }


# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print(f"🚀 {settings.app_name} v{settings.app_version} starting...")
    print(f"📍 Environment: {settings.environment}")
    print(f"🔗 API URL: http://{settings.host}:{settings.port}")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    print(f"👋 {settings.app_name} shutting down...")


def main():
    """Main entry point for running the application"""
    import uvicorn
    
    uvicorn.run(
        "ingredientos_backend.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.is_development,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    main()
vel=settings.log_level.lower(),
    )


if __name__ == "__main__":
    main()
