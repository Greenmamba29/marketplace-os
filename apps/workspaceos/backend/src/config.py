from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Workspaceos API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8018
    SECRET_KEY: str = "secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: List[str] = ["*"]
    BASEROW_URL: str = "https://api.baserow.io"
    BASEROW_TOKEN: str = ""
    BASEROW_USERS_TABLE_ID: int = 0
    BASEROW_PARTS_TABLE_ID: int = 0
    BASEROW_RFQ_TABLE_ID: int = 0
    BASEROW_QUOTES_TABLE_ID: int = 0
    BASEROW_ORDERS_TABLE_ID: int = 0
    STRIPE_SECRET_KEY: str = ""

    class Config:
        env_file = ".env"

def get_settings():
    return Settings()

class UserRole:
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"

class OrderStatus:
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class RFQStatus:
    SUBMITTED = "submitted"
    CLOSED = "closed"

class QuoteStatus:
    SUBMITTED = "submitted"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
