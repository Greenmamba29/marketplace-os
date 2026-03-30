"""API routers."""

from .auth import router as auth_router
from .materials import router as materials_router
from .projects import router as projects_router
from .rfq import router as rfq_router
from .quotes import router as quotes_router
from .orders import router as orders_router
from .admin import router as admin_router
from .leed import router as leed_router
from .accio import router as accio_router

__all__ = [
    "auth_router",
    "materials_router",
    "projects_router",
    "rfq_router",
    "quotes_router",
    "orders_router",
    "admin_router",
    "leed_router",
    "accio_router",
]
