"""API routers."""

from .auth import router as auth_router
from .products import router as products_router
from .rfq import router as rfq_router
from .quotes import router as quotes_router
from .orders import router as orders_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "products_router",
    "rfq_router",
    "quotes_router",
    "orders_router",
    "admin_router",
]
