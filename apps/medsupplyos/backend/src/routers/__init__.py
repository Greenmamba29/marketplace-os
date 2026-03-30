"""API routers for MedSupplyOS."""

from .auth import router as auth_router
from .equipment import router as equipment_router
from .rfq import router as rfq_router
from .quotes import router as quotes_router
from .orders import router as orders_router
from .gpo import router as gpo_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "equipment_router",
    "rfq_router",
    "quotes_router",
    "orders_router",
    "gpo_router",
    "admin_router",
]
