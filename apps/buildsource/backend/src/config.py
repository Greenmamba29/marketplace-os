"""Application configuration settings."""

import os
from functools import lru_cache
from typing import List, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "BuildSource API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    
    # Security
    SECRET_KEY: str = Field(default="change-me-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = Field(default_factory=lambda: ["http://localhost:3000"])
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/buildsource"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Baserow
    BASEROW_URL: str = "https://api.baserow.io"
    BASEROW_API_KEY: str = ""
    BASEROW_DATABASE_ID: int = 0
    
    # Medusa.js (for fulfillment)
    MEDUSA_URL: Optional[str] = None
    MEDUSA_API_KEY: Optional[str] = None
    
    # AWS S3 (for file storage)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: str = "buildsource-files"
    AWS_S3_REGION: str = "us-east-1"
    
    # Stripe (for payments)
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # SendGrid (for emails)
    SENDGRID_API_KEY: Optional[str] = None
    SENDGRID_FROM_EMAIL: str = "noreply@buildsource.io"
    
    # Sentry (for error tracking)
    SENTRY_DSN: Optional[str] = None
    
    # ACCIO Emergency Service
    ACCIO_ENABLED: bool = True
    ACCIO_MAX_RADIUS_MILES: int = 100
    ACCIO_PREMIUM_MULTIPLIER: float = 1.5
    
    # LEED Settings
    LEED_REGIONAL_RADIUS_MILES: int = 100
    LEED_DEFAULT_TARGET: str = "certified"
    
    # Regional Settings
    DEFAULT_SEARCH_RADIUS_MILES: int = 50
    MAX_SEARCH_RADIUS_MILES: int = 500
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.ENVIRONMENT == "production"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
