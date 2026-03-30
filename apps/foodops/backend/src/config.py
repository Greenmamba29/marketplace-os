"""Configuration settings for FoodOps backend."""

import os
from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
    
    # Application
    APP_NAME: str = "FoodOps API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "https://foodops.io"]
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/foodops"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_POOL_SIZE: int = 10
    
    # Baserow
    BASEROW_URL: str = "https://api.baserow.io"
    BASEROW_API_TOKEN: str = ""
    BASEROW_DATABASE_ID: Optional[int] = None
    
    # Baserow Table IDs
    BASEROW_USERS_TABLE_ID: Optional[int] = None
    BASEROW_SUPPLIERS_TABLE_ID: Optional[int] = None
    BASEROW_PRODUCTS_TABLE_ID: Optional[int] = None
    BASEROW_RFQ_TABLE_ID: Optional[int] = None
    BASEROW_QUOTES_TABLE_ID: Optional[int] = None
    BASEROW_ORDERS_TABLE_ID: Optional[int] = None
    BASEROW_MENU_ITEMS_TABLE_ID: Optional[int] = None
    BASEROW_LOT_TRACKING_TABLE_ID: Optional[int] = None
    BASEROW_TEMPERATURE_LOGS_TABLE_ID: Optional[int] = None
    BASEROW_ALLERGEN_REGISTRY_TABLE_ID: Optional[int] = None
    
    # Medusa.js
    MEDUSA_URL: str = "http://localhost:9000"
    MEDUSA_API_KEY: str = ""
    
    # Cold Chain Monitoring
    TEMPERATURE_ALERT_THRESHOLD_MINUTES: int = 15
    TEMPERATURE_CHECK_INTERVAL_SECONDS: int = 60
    
    # FSMA Compliance
    FSMA_TRACEABILITY_ENABLED: bool = True
    LOT_RETENTION_DAYS: int = 2555  # 7 years
    
    # AI Forecasting
    FORECAST_MODEL_PATH: str = "./models"
    FORECAST_HORIZON_DAYS: int = 14
    FORECAST_RETRAIN_INTERVAL_HOURS: int = 24
    
    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@foodops.io"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: List[str] = [".pdf",".jpg", ".jpeg", ".png", ".doc", ".docx"]
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    PROMETHEUS_ENABLED: bool = True
    LOG_LEVEL: str = "INFO"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from string if needed."""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.ENVIRONMENT.lower() == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.ENVIRONMENT.lower() == "production"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
