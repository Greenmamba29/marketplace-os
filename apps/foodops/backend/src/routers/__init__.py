"""API routers for FoodOps backend."""

from .auth import router as auth_router
from .ingredients import router as ingredients_router
from .menu import router as menu_router
from .rfq import router as rfq_router
from .quotes import router as quotes_router
from .orders import router as orders_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "ingredients_router",
    "menu_router",
    "rfq_router",
    "quotes_router",
    "orders_router",
    "admin_router",
]
