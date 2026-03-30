"""Application configuration settings."""

from functools import lru_cache
from typing import List, Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )
    
    # Application
    app_name: str = "LithiumBuy API"
    app_version: str = "1.0.0"
    debug: bool = Field(default=False, alias="DEBUG")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    
    # Server
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    
    # Security
    secret_key: str = Field(default="your-secret-key-change-in-production", alias="SECRET_KEY")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # CORS
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        alias="CORS_ORIGINS"
    )
    
    # Baserow
    baserow_url: str = Field(default="https://api.baserow.io", alias="BASEROW_URL")
    baserow_token: str = Field(default="", alias="BASEROW_TOKEN")
    baserow_database_id: int = Field(default=0, alias="BASEROW_DATABASE_ID")
    
    # Baserow Table IDs
    users_table_id: int = Field(default=0, alias="USERS_TABLE_ID")
    suppliers_table_id: int = Field(default=0, alias="SUPPLIERS_TABLE_ID")
    products_table_id: int = Field(default=0, alias="PRODUCTS_TABLE_ID")
    rfq_table_id: int = Field(default=0, alias="RFQ_TABLE_ID")
    quotes_table_id: int = Field(default=0, alias="QUOTES_TABLE_ID")
    orders_table_id: int = Field(default=0, alias="ORDERS_TABLE_ID")
    contracts_table_id: int = Field(default=0, alias="CONTRACTS_TABLE_ID")
    spot_prices_table_id: int = Field(default=0, alias="SPOT_PRICES_TABLE_ID")
    mines_table_id: int = Field(default=0, alias="MINES_TABLE_ID")
    alerts_table_id: int = Field(default=0, alias="ALERTS_TABLE_ID")
    
    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    
    # Pricing Engine
    price_update_interval_seconds: int = 60
    
    # External APIs
    accio_api_url: Optional[str] = Field(default=None, alias="ACCIO_API_URL")
    accio_api_key: Optional[str] = Field(default=None, alias="ACCIO_API_KEY")
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.environment.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.environment.lower() == "development"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
