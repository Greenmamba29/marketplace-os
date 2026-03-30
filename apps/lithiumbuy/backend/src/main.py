"""LithiumBuy Marketplace API - Main Application."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.config import settings
from src.routers import (
    admin_router,
    auth_router,
    contracts_router,
    materials_router,
    pricing_router,
    quotes_router,
    rfq_router,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting LithiumBuy API...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down LithiumBuy API...")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Global B2B Marketplace for Lithium Materials",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    openapi_url="/openapi.json" if settings.is_development else None,
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


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unhandled exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "message": str(exc) if settings.debug else "An unexpected error occurred",
        },
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.app_version,
        "environment": settings.environment,
    }


# API version endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "description": "Global B2B Marketplace for Lithium Materials",
        "docs": "/docs" if settings.is_development else None,
    }


# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(materials_router, prefix="/api/v1")
app.include_router(pricing_router, prefix="/api/v1")
app.include_router(contracts_router, prefix="/api/v1")
app.include_router(rfq_router, prefix="/api/v1")
app.include_router(quotes_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/payments", tags=["payments"])



# Intelligence router (inline for simplicity)
from fastapi import APIRouter, Depends
from src.routers.auth import get_current_active_user
from src.services.baserow import baserow_service

intelligence_router = APIRouter(prefix="/intelligence", tags=["Intelligence"])


@intelligence_router.get("/supply-alerts")
async def get_supply_alerts(current_user: dict = Depends(get_current_active_user)):
    """Get supply alerts."""
    from datetime import datetime
    
    # Mock data
    alerts = [
        {
            "id": "1",
            "alert_type": "tightness",
            "severity": "high",
            "material_form": "carbonate",
            "region": "South America",
            "message": "Supply tightness detected in Chilean lithium carbonate market",
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
        },
        {
            "id": "2",
            "alert_type": "price_spike",
            "severity": "medium",
            "material_form": "hydroxide",
            "region": "Asia",
            "message": "Hydroxide prices increased 5% in past 24 hours",
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
        },
    ]
    
    return {"success": True, "data": alerts}


@intelligence_router.get("/market-summary")
async def get_market_summary(current_user: dict = Depends(get_current_active_user)):
    """Get market summary."""
    from datetime import datetime
    
    summary = {
        "total_volume_24h": 12450,
        "active_rfqs": 847,
        "open_contracts": 1234,
        "avg_quote_response_hours": 4.2,
        "price_volatility_index": 0.23,
        "supply_tightness_score": 65,
        "last_updated": datetime.utcnow().isoformat(),
    }
    
    return {"success": True, "data": summary}


@intelligence_router.get("/geopolitical-risks")
async def get_geopolitical_risks(
    country: str = None,
    current_user: dict = Depends(get_current_active_user),
):
    """Get geopolitical risks."""
    from datetime import datetime
    
    risks = [
        {
            "country": "Australia",
            "risk_score": 15,
            "risk_level": "low",
            "factors": ["Stable government", "Strong rule of law"],
            "last_updated": datetime.utcnow().isoformat(),
        },
        {
            "country": "Chile",
            "risk_score": 35,
            "risk_level": "medium",
            "factors": ["Policy uncertainty", "Social unrest"],
            "last_updated": datetime.utcnow().isoformat(),
        },
        {
            "country": "Argentina",
            "risk_score": 55,
            "risk_level": "medium",
            "factors": ["Economic volatility", "Currency risk"],
            "last_updated": datetime.utcnow().isoformat(),
        },
    ]
    
    if country:
        risks = [r for r in risks if r["country"].lower() == country.lower()]
    
    return {"success": True, "data": risks}


app.include_router(intelligence_router, prefix="/api/v1")


def main():
    """Run the application."""
    import uvicorn
    
    uvicorn.run(
        "src.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.is_development,
        log_level="info" if not settings.debug else "debug",
    )


if __name__ == "__main__":
    main()
