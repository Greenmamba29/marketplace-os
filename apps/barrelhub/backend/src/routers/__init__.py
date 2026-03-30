"""API routers for BarrelHub backend."""

from .auth import router as auth_router
from .barrels import router as barrels_router
from .registry import router as registry_router
from .sensory import router as sensory_router
from .rfq import router as rfq_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "barrels_router",
    "registry_router",
    "sensory_router",
    "rfq_router",
    "admin_router",
]
