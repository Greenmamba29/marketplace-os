"""
GovSource Backend Configuration
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    app_name: str = Field(default="GovSource API", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    debug: bool = Field(default=False, alias="DEBUG")
    
    # Server
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    
    # Security
    secret_key: str = Field(default="your-secret-key-change-in-production", alias="SECRET_KEY")
    algorithm: str = Field(default="HS256", alias="ALGORITHM")
    access_token_expire_minutes: int = Field(default=60 * 24, alias="ACCESS_TOKEN_EXPIRE_MINUTES")  # 24 hours
    
    # CORS
    cors_origins: list[str] = Field(default=["http://localhost:5173"], alias="CORS_ORIGINS")
    
    # Baserow
    baserow_url: str = Field(default="https://api.baserow.io", alias="BASEROW_URL")
    baserow_token: str = Field(default="", alias="BASEROW_TOKEN")
    baserow_database_id: int = Field(default=0, alias="BASEROW_DATABASE_ID")
    
    # SAM.gov API
    sam_gov_api_key: str = Field(default="", alias="SAM_GOV_API_KEY")
    sam_gov_base_url: str = Field(default="https://api.sam.gov", alias="SAM_GOV_BASE_URL")
    
    # OroCommerce (if using)
    orocommerce_url: str = Field(default="", alias="OROCOMMERCE_URL")
    orocommerce_api_key: str = Field(default="", alias="OROCOMMERCE_API_KEY")
    
    # Logging
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
