"""
Configuration settings for IngredientOS Backend
"""

from functools import lru_cache
from typing import List, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )
    
    # Application
    app_name: str = "IngredientOS API"
    app_version: str = "1.0.0"
    debug: bool = Field(default=False, alias="DEBUG")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    
    # Server
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    
    # Security
    secret_key: str = Field(default="your-secret-key-change-in-production", alias="SECRET_KEY")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours
    
    # CORS
    cors_origins: List[str] = Field(default=["http://localhost:3000"], alias="CORS_ORIGINS")
    
    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    # Baserow Integration
    baserow_api_url: str = Field(default="https://api.baserow.io", alias="BASEROW_API_URL")
    baserow_token: str = Field(default="", alias="BASEROW_TOKEN")
    baserow_database_id: int = Field(default=0, alias="BASEROW_DATABASE_ID")
    
    # Saleor Integration
    saleor_api_url: str = Field(default="", alias="SALEOR_API_URL")
    saleor_token: str = Field(default="", alias="SALEOR_TOKEN")
    
    # FDA GRAS API (for verification)
    fda_api_url: str = Field(default="https://api.fda.gov", alias="FDA_API_URL")
    
    # Sentry
    sentry_dsn: Optional[str] = Field(default=None, alias="SENTRY_DSN")
    
    # Logging
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    
    # Feature Flags
    enable_gras_verification: bool = Field(default=True, alias="ENABLE_GRAS_VERIFICATION")
    enable_certification_check: bool = Field(default=True, alias="ENABLE_CERTIFICATION_CHECK")
    
    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Baserow Table Names (for reference)
BASEROW_TABLES = {
    "users": "USERS",
    "suppliers": "SUPPLIERS",
    "products": "PRODUCTS",
    "regulatory_status": "REGULATORY_STATUS",
    "certifications": "CERTIFICATIONS",
    "allergen_profiles": "ALLERGEN_PROFILES",
    "functional_claims": "FUNCTIONAL_CLAIMS",
    "rfq_submissions": "RFQ_SUBMISSIONS",
    "quotes": "QUOTES",
    "orders": "ORDERS",
    "payments": "PAYMENTS",
    "compliance_records": "COMPLIANCE_RECORDS",
    "audit_log": "AUDIT_LOG",
    "food_defense_docs": "FOOD_DEFENSE_DOCS",
}

# Certification Types
CERTIFICATION_TYPES = {
    "organic": "USDA Organic",
    "non_gmo": "Non-GMO Project Verified",
    "kosher": "Kosher Certified",
    "halal": "Halal Certified",
    "gras": "FDA GRAS",
    "iso22000": "ISO 22000",
    "fsma": "FSMA Compliant",
    "sqf": "SQF Certified",
    "brc": "BRC Certified",
}

# Major Allergens (FALCPA)
MAJOR_ALLERGENS = [
    "milk",
    "eggs",
    "fish",
    "crustacean_shellfish",
    "tree_nuts",
    "peanuts",
    "wheat",
    "soybeans",
    "sesame",
]

# Ingredient Categories
INGREDIENT_CATEGORIES = [
    "sweeteners",
    "flavors",
    "colors",
    "preservatives",
    "emulsifiers",
    "stabilizers",
    "thickeners",
    "antioxidants",
    "acids",
    "bases",
    "enzymes",
    "probiotics",
    "proteins",
    "fibers",
    "oils_fats",
    "extracts",
    "vitamins_minerals",
    "specialty",
]
