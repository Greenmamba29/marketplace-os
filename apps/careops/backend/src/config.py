"""Application configuration and settings."""

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
    app_name: str = Field(default="CareOps API", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    debug: bool = Field(default=False, alias="DEBUG")
    environment: str = Field(default="production", alias="ENVIRONMENT")

    # Server
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    workers: int = Field(default=1, alias="WORKERS")

    # Security
    secret_key: str = Field(default="change-me-in-production", alias="SECRET_KEY")
    algorithm: str = Field(default="HS256", alias="ALGORITHM")
    access_token_expire_minutes: int = Field(default=60 * 24, alias="ACCESS_TOKEN_EXPIRE_MINUTES")  # 24 hours
    refresh_token_expire_days: int = Field(default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    # CORS
    cors_origins: List[str] = Field(default=["*"], alias="CORS_ORIGINS")
    cors_allow_credentials: bool = Field(default=True, alias="CORS_ALLOW_CREDENTIALS")
    cors_allow_methods: List[str] = Field(default=["*"], alias="CORS_ALLOW_METHODS")
    cors_allow_headers: List[str] = Field(default=["*"], alias="CORS_ALLOW_HEADERS")

    # Baserow Integration
    baserow_api_url: str = Field(default="https://api.baserow.io", alias="BASEROW_API_URL")
    baserow_api_token: str = Field(default="", alias="BASEROW_API_TOKEN")
    baserow_database_id: Optional[int] = Field(default=None, alias="BASEROW_DATABASE_ID")

    # Baserow Table IDs
    baserow_users_table_id: Optional[int] = Field(default=None, alias="BASEROW_USERS_TABLE_ID")
    baserow_caregivers_table_id: Optional[int] = Field(default=None, alias="BASEROW_CAREGIVERS_TABLE_ID")
    baserow_care_plans_table_id: Optional[int] = Field(default=None, alias="BASEROW_CARE_PLANS_TABLE_ID")
    baserow_schedules_table_id: Optional[int] = Field(default=None, alias="BASEROW_SCHEDULES_TABLE_ID")
    baserow_background_checks_table_id: Optional[int] = Field(default=None, alias="BASEROW_BG_CHECKS_TABLE_ID")
    baserow_payer_auths_table_id: Optional[int] = Field(default=None, alias="BASEROW_PAYER_AUTHS_TABLE_ID")

    # Background Check Providers
    checkr_api_key: Optional[str] = Field(default=None, alias="CHECKR_API_KEY")
    checkr_webhook_secret: Optional[str] = Field(default=None, alias="CHECKR_WEBHOOK_SECRET")
    sterling_api_key: Optional[str] = Field(default=None, alias="STERLING_API_KEY")
    sterling_webhook_secret: Optional[str] = Field(default=None, alias="STERLING_WEBHOOK_SECRET")

    # Email/SMS Notifications
    sendgrid_api_key: Optional[str] = Field(default=None, alias="SENDGRID_API_KEY")
    twilio_account_sid: Optional[str] = Field(default=None, alias="TWILIO_ACCOUNT_SID")
    twilio_auth_token: Optional[str] = Field(default=None, alias="TWILIO_AUTH_TOKEN")
    twilio_phone_number: Optional[str] = Field(default=None, alias="TWILIO_PHONE_NUMBER")

    # Logging
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    log_format: str = Field(default="json", alias="LOG_FORMAT")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, v):
        """Validate environment value."""
        allowed = ["development", "staging", "production"]
        if v.lower() not in allowed:
            raise ValueError(f"Environment must be one of: {', '.join(allowed)}")
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
