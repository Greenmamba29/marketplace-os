from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routers import auth, products, rfq, quotes, orders, admin

def create_application() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
    
    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(products.router, prefix="/api/products", tags=["Products"])
    app.include_router(rfq.router, prefix="/api/rfq", tags=["RFQ"])
    app.include_router(quotes.router, prefix="/api/quotes", tags=["Quotes"])
    app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
    app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
    app.include_router(payments.router, prefix="/api/payments", tags=["payments"])

    return app

app = create_application()

if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
