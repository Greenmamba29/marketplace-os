"""Configuration settings for BarrelHub backend."""

from functools import lru_cache
from typing import List, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = Field(default="BarrelHub API", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    debug: bool = Field(default=False, alias="DEBUG")
    environment: str = Field(default="production", alias="ENVIRONMENT")

    # Server
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    workers: int = Field(default=1, alias="WORKERS")

    # Security
    secret_key: str = Field(default="change-me-in-production", alias="SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    # CORS
    cors_origins: List[str] = Field(default=["*"], alias="CORS_ORIGINS")
    cors_allow_credentials: bool = Field(default=True, alias="CORS_ALLOW_CREDENTIALS")
    cors_allow_methods: List[str] = Field(default=["*"], alias="CORS_ALLOW_METHODS")
    cors_allow_headers: List[str] = Field(default=["*"], alias="CORS_ALLOW_HEADERS")

    # Baserow
    baserow_api_url: str = Field(default="https://api.baserow.io", alias="BASEROW_API_URL")
    baserow_api_key: str = Field(default="", alias="BASEROW_API_KEY")
    baserow_database_id: Optional[int] = Field(default=None, alias="BASEROW_DATABASE_ID")

    # Baserow Table IDs
    baserow_users_table_id: Optional[int] = Field(default=None, alias="BASEROW_USERS_TABLE_ID")
    baserow_suppliers_table_id: Optional[int] = Field(default=None, alias="BASEROW_SUPPLIERS_TABLE_ID")
    baserow_products_table_id: Optional[int] = Field(default=None, alias="BASEROW_PRODUCTS_TABLE_ID")
    baserow_barrel_registry_table_id: Optional[int] = Field(default=None, alias="BASEROW_BARREL_REGISTRY_TABLE_ID")
    baserow_ttb_compliance_table_id: Optional[int] = Field(default=None, alias="BASEROW_TTB_COMPLIANCE_TABLE_ID")
    baserow_sensory_profiles_table_id: Optional[int] = Field(default=None, alias="BASEROW_SENSORY_PROFILES_TABLE_ID")
    baserow_market_comps_table_id: Optional[int] = Field(default=None, alias="BASEROW_MARKET_COMPS_TABLE_ID")
    baserow_rfq_table_id: Optional[int] = Field(default=None, alias="BASEROW_RFQ_TABLE_ID")
    baserow_quotes_table_id: Optional[int] = Field(default=None, alias="BASEROW_QUOTES_TABLE_ID")
    baserow_orders_table_id: Optional[int] = Field(default=None, alias="BASEROW_ORDERS_TABLE_ID")
    baserow_audit_log_table_id: Optional[int] = Field(default=None, alias="BASEROW_AUDIT_LOG_TABLE_ID")

    # TTB API (for permit verification)
    ttb_api_url: str = Field(default="https://api.ttb.gov", alias="TTB_API_URL")
    ttb_api_key: Optional[str] = Field(default=None, alias="TTB_API_KEY")
    ttb_verify_enabled: bool = Field(default=True, alias="TTB_VERIFY_ENABLED")

    # Rate Limiting
    rate_limit_requests: int = Field(default=100, alias="RATE_LIMIT_REQUESTS")
    rate_limit_window: int = Field(default=60, alias="RATE_LIMIT_WINDOW")

    # Logging
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    log_format: str = Field(default="json", alias="LOG_FORMAT")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        """Validate environment value."""
        allowed = {"development", "staging", "production"}
        if v.lower() not in allowed:
            raise ValueError(f"Environment must be one of {allowed}")
        return v.lower()

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment == "production"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Export settings instance
settings = get_settings()
