"""API routers."""

from .auth import router as auth_router
from .inputs import router as inputs_router
from .agronomy import router as agronomy_router
from .rfq import router as rfq_router
from .quotes import router as quotes_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "inputs_router",
    "agronomy_router",
    "rfq_router",
    "quotes_router",
    "admin_router",
]
