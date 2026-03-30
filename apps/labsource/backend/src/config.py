"""
LabSource Configuration Module
"""

import os
from functools import lru_cache
from typing import List, Optional

from pydantic import Field, PostgresDsn, RedisDsn
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
    app_name: str = "LabSource API"
    app_version: str = "1.0.0"
    debug: bool = Field(default=False, alias="DEBUG")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 1
    
    # Security
    secret_key: str = Field(default="change-me-in-production", alias="SECRET_KEY")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours
    refresh_token_expire_days: int = 7
    
    # CORS
    cors_origins: List[str] = Field(default=["http://localhost:3000"], alias="CORS_ORIGINS")
    
    # Database
    database_url: PostgresDsn = Field(
        default="postgresql://postgres:postgres@localhost:5432/labsource",
        alias="DATABASE_URL"
    )
    
    # Redis
    redis_url: RedisDsn = Field(
        default="redis://localhost:6379/0",
        alias="REDIS_URL"
    )
    
    # Baserow Integration
    baserow_url: str = Field(default="https://api.baserow.io", alias="BASEROW_URL")
    baserow_token: str = Field(default="", alias="BASEROW_TOKEN")
    baserow_database_id: int = Field(default=0, alias="BASEROW_DATABASE_ID")
    
    # Saleor Integration
    saleor_url: str = Field(default="", alias="SALEOR_URL")
    saleor_token: str = Field(default="", alias="SALEOR_TOKEN")
    saleor_channel: str = Field(default="default-channel", alias="SALEOR_CHANNEL")
    
    # Email (SendGrid)
    sendgrid_api_key: str = Field(default="", alias="SENDGRID_API_KEY")
    email_from: str = Field(default="noreply@labsource.io", alias="EMAIL_FROM")
    
    # Storage (S3)
    aws_access_key_id: str = Field(default="", alias="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str = Field(default="", alias="AWS_SECRET_ACCESS_KEY")
    aws_s3_bucket: str = Field(default="labsource-docs", alias="AWS_S3_BUCKET")
    aws_region: str = Field(default="us-east-1", alias="AWS_REGION")
    
    # Stripe
    stripe_secret_key: str = Field(default="", alias="STRIPE_SECRET_KEY")
    stripe_webhook_secret: str = Field(default="", alias="STRIPE_WEBHOOK_SECRET")
    
    # Sentry
    sentry_dsn: str = Field(default="", alias="SENTRY_DSN")
    
    # CLIA Configuration
    clia_validation_enabled: bool = Field(default=True, alias="CLIA_VALIDATION_ENABLED")
    
    # Cold Chain
    cold_chain_alert_threshold_minutes: int = 15
    temp_excursion_tolerance_c: float = 2.0
    
    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Database table mappings for Baserow
BASEROW_TABLES = {
    "users": "USERS",
    "suppliers": "SUPPLIERS",
    "products": "PRODUCTS",
    "lots": "LOT_REGISTRY",
    "rfq_submissions": "RFQ_SUBMISSIONS",
    "quotes": "QUOTES",
    "orders": "ORDERS",
    "payments": "PAYMENTS",
    "cold_chain_compliance": "COLD_CHAIN_COMPLIANCE",
    "grant_procurement": "GRANT_PROCUREMENT",
    "clia_registry": "CLIA_REGISTRY",
    "compliance_records": "COMPLIANCE_RECORDS",
    "audit_log": "AUDIT_LOG",
}

# Storage temperature mappings
STORAGE_TEMPS = {
    "RT": {"min": 15, "max": 25, "label": "Room Temperature"},
    "2-8C": {"min": 2, "max": 8, "label": "Refrigerated"},
    "-20C": {"min": -25, "max": -15, "label": "Frozen"},
    "-80C": {"min": -85, "max": -75, "label": "Ultra-low"},
    "LN2": {"min": -196, "max": -150, "label": "Liquid Nitrogen"},
}

# CLIA complexity levels
CLIA_COMPLEXITY = {
    "waived": {"level": 1, "requirements": "minimal"},
    "moderate": {"level": 2, "requirements": "standard"},
    "high": {"level": 3, "requirements": "extensive"},
}

# Grant agencies
GRANT_AGENCIES = ["NSF", "NIH", "DOE", "DOD", "USDA", "other"]

# Reagent grades
REAGENT_GRADES = ["research", "analytical", "molecular-biology", "cell-culture", "USP", "EP"]

# Organization types
ORGANIZATION_TYPES = ["academic", "pharma", "biotech", "cRO", "diagnostic", "government"]
