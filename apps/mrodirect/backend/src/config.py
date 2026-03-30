"""Application configuration and settings."""

from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "MRODirect API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://mrodirect.io"]
    
    # Baserow
    BASEROW_URL: str = "https://api.baserow.io"
    BASEROW_TOKEN: str = ""
    BASEROW_DATABASE_ID: int = 0
    
    # Baserow Table IDs
    BASEROW_USERS_TABLE_ID: Optional[int] = None
    BASEROW_SUPPLIERS_TABLE_ID: Optional[int] = None
    BASEROW_PARTS_TABLE_ID: Optional[int] = None
    BASEROW_MACHINES_TABLE_ID: Optional[int] = None
    BASEROW_RFQ_TABLE_ID: Optional[int] = None
    BASEROW_QUOTES_TABLE_ID: Optional[int] = None
    BASEROW_ORDERS_TABLE_ID: Optional[int] = None
    BASEROW_CONTRACTS_TABLE_ID: Optional[int] = None
    
    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    
    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@mrodirect.io"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    # Cache
    CACHE_TTL: int = 300  # 5 minutes
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str]:
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Baserow table names to ID mapping
BASEROW_TABLES = {
    "users": "USERS",
    "suppliers": "SUPPLIERS",
    "parts_catalog": "PARTS_CATALOG",
    "machine_registry": "MACHINE_REGISTRY",
    "supplier_contracts": "SUPPLIER_CONTRACTS",
    "rfq_submissions": "RFQ_SUBMISSIONS",
    "quotes": "QUOTES",
    "orders": "ORDERS",
    "payments": "PAYMENTS",
    "compliance_records": "COMPLIANCE_RECORDS",
    "audit_log": "AUDIT_LOG",
}

# User roles
class UserRole:
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"

# Order statuses
class OrderStatus:
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"

# RFQ statuses
class RFQStatus:
    DRAFT = "draft"
    SUBMITTED = "submitted"
    QUOTING = "quoting"
    CLOSED = "closed"
    CANCELLED = "cancelled"

# Quote statuses
class QuoteStatus:
    DRAFT = "draft"
    SUBMITTED = "submitted"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"
