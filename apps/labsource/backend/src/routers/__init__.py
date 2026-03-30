"""
LabSource API Routers
"""

from fastapi import APIRouter

from .auth import router as auth_router
from .reagents import router as reagents_router
from .lots import router as lots_router
from .coldchain import router as coldchain_router
from .rfq import router as rfq_router
from .admin import router as admin_router

# Main API router
api_router = APIRouter(prefix="/api/v1")

# Include all routers
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(reagents_router, prefix="/reagents", tags=["Reagents"])
api_router.include_router(lots_router, prefix="/lots", tags=["Lots"])
api_router.include_router(coldchain_router, prefix="/coldchain", tags=["Cold Chain"])
api_router.include_router(rfq_router, prefix="/rfq", tags=["RFQ"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])

__all__ = ["api_router"]
