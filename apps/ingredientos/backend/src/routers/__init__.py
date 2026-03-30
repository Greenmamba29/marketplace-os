"""
API Routers for IngredientOS
"""

from .auth import router as auth_router
from .ingredients import router as ingredients_router
from .regulatory import router as regulatory_router
from .rfq import router as rfq_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "ingredients_router",
    "regulatory_router",
    "rfq_router",
    "admin_router",
]
