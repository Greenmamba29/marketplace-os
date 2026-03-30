"""ChemOS FastAPI Application — Neon DB + Baserow hybrid."""

import sentry_sdk
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app

from src.config import get_settings
from src.database import create_tables
from src.routers import auth, chemicals, rfq, quotes, orders, compliance, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run DB table creation on startup (idempotent; Alembic preferred in prod)."""
    await create_tables()
    yield


settings = get_settings()
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ChemOS — Specialty Chemicals B2B Marketplace API (Neon DB + Baserow)",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    openapi_url="/api/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION}


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/api/docs" if settings.DEBUG else None,
    }


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chemicals.router, prefix="/api/chemicals", tags=["Chemicals"])
app.include_router(rfq.router, prefix="/api/rfq", tags=["RFQ"])
app.include_router(quotes.router, prefix="/api/quotes", tags=["Quotes"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(compliance.router, prefix="/api/compliance", tags=["Compliance"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])



def main():
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host=settings.HOST,
        port=settings.PORT,
        workers=settings.WORKERS if not settings.DEBUG else 1,
        reload=settings.DEBUG,
    )


if __name__ == "__main__":
    main()
