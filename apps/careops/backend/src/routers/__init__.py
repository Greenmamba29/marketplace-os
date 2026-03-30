"""API route handlers."""

from .auth import router as auth_router
from .caregivers import router as caregivers_router
from .careplans import router as careplans_router
from .scheduling import router as scheduling_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "caregivers_router",
    "careplans_router",
    "scheduling_router",
    "admin_router",
]
