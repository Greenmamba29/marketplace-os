"""
GovSource Backend Routers
"""

from .auth import router as auth_router
from .vendors import router as vendors_router
from .rfps import router as rfps_router
from .compliance import router as compliance_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "vendors_router",
    "rfps_router",
    "compliance_router",
    "admin_router",
]
