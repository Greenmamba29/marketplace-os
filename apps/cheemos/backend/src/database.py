"""Neon DB (PostgreSQL) async database setup via SQLAlchemy."""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from src.config import get_settings


class Base(DeclarativeBase):
    pass


def _build_engine():
    settings = get_settings()
    url = settings.DATABASE_URL
    # Neon requires SSL; asyncpg driver with ?sslmode=require handled via connect_args
    connect_args = {}
    if "neon.tech" in url or settings.DB_SSL:
        connect_args["ssl"] = "require"
    return create_async_engine(
        url,
        echo=settings.DEBUG,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        connect_args=connect_args,
    )


engine = _build_engine()

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def create_tables():
    """Create all tables (used in dev/test; prefer Alembic for prod)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
