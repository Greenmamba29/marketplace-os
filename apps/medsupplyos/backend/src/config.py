"""Configuration settings for MedSupplyOS backend."""

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
    app_name: str = Field(default="MedSupplyOS", alias="APP_NAME")
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
    baserow_url: str = Field(default="https://api.baserow.io", alias="BASEROW_URL")
    baserow_token: str = Field(default="", alias="BASEROW_TOKEN")
    baserow_database_id: int = Field(default=0, alias="BASEROW_DATABASE_ID")
    
    # FDA API
    fda_api_url: str = Field(default="https://api.fda.gov", alias="FDA_API_URL")
    fda_api_key: Optional[str] = Field(default=None, alias="FDA_API_KEY")
    
    # OroCommerce
    orocommerce_url: Optional[str] = Field(default=None, alias="OROCOMMERCE_URL")
    orocommerce_client_id: Optional[str] = Field(default=None, alias="OROCOMMERCE_CLIENT_ID")
    orocommerce_client_secret: Optional[str] = Field(default=None, alias="OROCOMMERCE_CLIENT_SECRET")
    
    # Email
    smtp_host: Optional[str] = Field(default=None, alias="SMTP_HOST")
    smtp_port: int = Field(default=587, alias="SMTP_PORT")
    smtp_username: Optional[str] = Field(default=None, alias="SMTP_USERNAME")
    smtp_password: Optional[str] = Field(default=None, alias="SMTP_PASSWORD")
    smtp_tls: bool = Field(default=True, alias="SMTP_TLS")
    
    # Monitoring
    sentry_dsn: Optional[str] = Field(default=None, alias="SENTRY_DSN")
    prometheus_enabled: bool = Field(default=True, alias="PROMETHEUS_ENABLED")
    
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
        if v not in allowed:
            raise ValueError(f"Environment must be one of {allowed}")
        return v
    
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


# Baserow Table IDs (configured via environment)
BASEROW_TABLES = {
    "users": "users",
    "suppliers": "suppliers",
    "products": "products",
    "equipment": "equipment",
    "facilities": "facilities",
    "departments": "departments",
    "rfq_submissions": "rfq_submissions",
    "quotes": "quotes",
    "orders": "orders",
    "payments": "payments",
    "compliance_records": "compliance_records",
    "regulatory_clearances": "regulatory_clearances",
    "gpo_contracts": "gpo_contracts",
    "biomedical_equipment": "biomedical_equipment",
    "audit_log": "audit_log",
}

# FDA Device Classification
FDA_DEVICE_CLASSES = {
    "I": "Class I - Low Risk",
    "II": "Class II - Moderate Risk",
    "III": "Class III - High Risk",
}

# GPO Tier Configuration
GPO_TIERS = {
    1: {"name": "Standard", "min_spend": 0, "discount": 0.10},
    2: {"name": "Preferred", "min_spend": 100000, "discount": 0.15},
    3: {"name": "Strategic", "min_spend": 500000, "discount": 0.20},
}
