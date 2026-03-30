"""Pydantic models for request/response validation."""

from .user import User, UserCreate, UserUpdate, UserInDB
from .part import Part, PartCreate, PartUpdate, PartSearchResult, SupplierPart
from .machine import Machine, MachineCreate, MachineUpdate
from .rfq import RFQSubmission, RFQCreate, RFQUpdate, RFQItem
from .quote import Quote, QuoteCreate, QuoteItem
from .order import Order, OrderCreate, OrderItem, Address
from .supplier import Supplier, SupplierCreate, SupplierUpdate, SupplierContract
from .common import PaginationParams, PaginatedResponse, APIResponse

__all__ = [
    # User
    "User",
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    # Part
    "Part",
    "PartCreate",
    "PartUpdate",
    "PartSearchResult",
    "SupplierPart",
    # Machine
    "Machine",
    "MachineCreate",
    "MachineUpdate",
    # RFQ
    "RFQSubmission",
    "RFQCreate",
    "RFQUpdate",
    "RFQItem",
    # Quote
    "Quote",
    "QuoteCreate",
    "QuoteItem",
    # Order
    "Order",
    "OrderCreate",
    "OrderItem",
    "Address",
    # Supplier
    "Supplier",
    "SupplierCreate",
    "SupplierUpdate",
    "SupplierContract",
    # Common
    "PaginationParams",
    "PaginatedResponse",
    "APIResponse",
]
