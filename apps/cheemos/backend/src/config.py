"""Application configuration."""

from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )
    
    # App
    APP_NAME: str = "ChemOS API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://cheemos.io"]
    
    # Database (Neon DB)
    # Use postgresql+asyncpg:// driver for async support.
    # Neon connection string format:
    #   postgresql+asyncpg://user:pass@ep-xxx.us-east-1.aws.neon.tech/cheemos?sslmode=require
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/cheemos"
    DB_SSL: bool = False  # auto-set to True if neon.tech in DATABASE_URL

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Baserow
    BASEROW_API_URL: str = "https://api.baserow.io"
    BASEROW_TOKEN: str = ""
    BASEROW_DATABASE_ID: int = 0
    
    # Saleor
    SALEOR_API_URL: str = ""
    SALEOR_TOKEN: str = ""
    
    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    
    # Anthropic (Claude)
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-sonnet-20240229"
    
    # Sentry
    SENTRY_DSN: Optional[str] = None
    
    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@cheemos.io"
    
    # File Storage
    STORAGE_BUCKET: str = "cheemos-uploads"
    STORAGE_REGION: str = "us-east-1"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from string if needed."""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Table IDs for Baserow
BASEROW_TABLES = {
    "USERS": 100001,
    "SUPPLIERS": 100002,
    "PRODUCTS": 100003,
    "CHEMICALS": 100001,
    "RFQ_SUBMISSIONS": 100004,
    "RFQ_ITEMS": 100005,
    "QUOTES": 100006,
    "QUOTE_ITEMS": 100007,
    "ORDERS": 100008,
    "COMPLIANCE_REGISTRY": 100009,
    "MARKET_INTELLIGENCE": 100010,
    "REGULATORY_ALERTS": 100011,
    "COMPLIANCE_REPORTS": 100012,
    "PAYMENTS": 100013,
    "AUDIT_LOG": 100014,
}

# Chemical categories
CHEMICAL_CATEGORIES = [
    "solvents",
    "reagents",
    "catalysts",
    "polymers",
    "intermediates",
    "active_pharmaceutical_ingredients",
    "food_additives",
    "cosmetic_ingredients",
    "electronic_chemicals",
    "agrochemicals",
]

# Chemical grades
CHEMICAL_GRADES = [
    "technical",
    "reagent",
    "acs",
    "pharmacopeia",
    "food",
    "cosmetic",
    "electronic",
    "spectrophotometric",
    "hplc",
    "gc_ms",
]

# Compliance statuses
REACH_STATUSES = ["registered", "pre_registered", "exempt", "not_required", "pending"]
TSCA_STATUSES = ["listed", "exempt", "snur", "pmn", "not_listed"]
EPA_STATUSES = ["approved", "restricted", "banned", "under_review"]

# Incoterms
INCOTERMS = ["EXW", "FOB", "CIF", "DAP", "DDP"]

# Payment terms
PAYMENT_TERMS = ["NET_30", "NET_60", "NET_90", "LC", "PREPAID"]
