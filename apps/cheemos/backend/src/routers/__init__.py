"""API routers for ChemOS backend."""

from src.routers.auth import router as auth_router
from src.routers.chemicals import router as chemicals_router
from src.routers.rfq import router as rfq_router
from src.routers.quotes import router as quotes_router
from src.routers.orders import router as orders_router
from src.routers.compliance import router as compliance_router
from src.routers.admin import router as admin_router

__all__ = [
    "auth_router",
    "chemicals_router",
    "rfq_router",
    "quotes_router",
    "orders_router",
    "compliance_router",
    "admin_router",
]
