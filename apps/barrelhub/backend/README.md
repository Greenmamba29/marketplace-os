# BarrelHub Backend

FastAPI backend for the BarrelHub B2B marketplace for bulk whiskey and spirits.

## Features

- **Barrel Management**: Individual barrel tracking with complete lifecycle history
- **TTB Compliance**: Automated permit verification and compliance documentation
- **Sensory Profiles**: Professional tasting notes and scoring
- **Market Intelligence**: Real-time comparable transactions and pricing trends
- **RFQ System**: Request for quote workflow with supplier matching
- **Admin Dashboard**: User management, verification, and analytics

## Tech Stack

- **Framework**: FastAPI 0.104+
- **Python**: 3.12+
- **Data Validation**: Pydantic v2
- **Authentication**: JWT with python-jose
- **Database**: Baserow (via REST API)
- **HTTP Client**: HTTPX
- **Testing**: pytest

## Quick Start

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Or install with dev dependencies
pip install -e ".[dev]"
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `SECRET_KEY`: JWT signing key
- `BASEROW_API_KEY`: Your Baserow API key
- `BASEROW_DATABASE_ID`: Baserow database ID

### Running

```bash
# Development (with auto-reload)
python -m barrelhub_backend.main

# Or using uvicorn directly
uvicorn barrelhub_backend.main:app --reload

# Production
uvicorn barrelhub_backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Documentation

When running in development mode:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI: http://localhost:8000/openapi.json

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Barrels
- `GET /api/v1/barrels` - List barrels with filters
- `GET /api/v1/barrels/{id}` - Get single barrel
- `POST /api/v1/barrels` - Create barrel listing
- `PATCH /api/v1/barrels/{id}` - Update barrel
- `DELETE /api/v1/barrels/{id}` - Delete barrel

### Registry
- `GET /api/v1/registry` - List registry entries
- `GET /api/v1/registry/barrel/{id}` - Get barrel registry
- `GET /api/v1/registry/barrel/{id}/history` - Get barrel history
- `POST /api/v1/registry/barrel/{id}/sample` - Add sample record
- `POST /api/v1/registry/barrel/{id}/movement` - Record movement

### Sensory Profiles
- `GET /api/v1/sensory` - List sensory profiles
- `GET /api/v1/sensory/barrel/{id}` - Get barrel profiles
- `GET /api/v1/sensory/distribution` - Get score distribution
- `POST /api/v1/sensory` - Create profile

### Market Comps
- `GET /api/v1/market-comps` - List comparable transactions
- `GET /api/v1/market-comps/trends` - Get price trends
- `GET /api/v1/market-comps/stats` - Get price statistics
- `GET /api/v1/market-comps/comparables/{id}` - Get comparables for barrel

### RFQ
- `GET /api/v1/rfq` - List RFQs
- `GET /api/v1/rfq/{id}` - Get single RFQ
- `POST /api/v1/rfq` - Create RFQ
- `POST /api/v1/rfq/{id}/submit` - Submit RFQ
- `POST /api/v1/rfq/{id}/quotes` - Submit quote
- `POST /api/v1/rfq/quotes/{id}/accept` - Accept quote

### Admin
- `GET /api/v1/admin/stats` - Dashboard statistics
- `GET /api/v1/admin/users` - List users
- `POST /api/v1/admin/users/{id}/verify` - Verify user
- `GET /api/v1/admin/pending-verifications` - Get pending verifications
- `GET /api/v1/admin/audit-log` - Get audit log

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=barrelhub_backend

# Run specific test file
pytest tests/test_barrels.py
```

## Project Structure

```
backend/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Settings and configuration
│   ├── models/              # Pydantic models
│   │   ├── __init__.py
│   │   ├── barrel.py
│   │   ├── sensory.py
│   │   ├── market.py
│   │   ├── rfq.py
│   │   ├── user.py
│   │   └── ttb.py
│   ├── routers/             # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── barrels.py
│   │   ├── registry.py
│   │   ├── sensory.py
│   │   ├── rfq.py
│   │   └── admin.py
│   └── services/            # Business logic
│       ├── __init__.py
│       ├── baserow.py       # Baserow integration
│       ├── ttb.py           # TTB verification
│       └── market_comps.py  # Market intelligence
├── tests/                   # Test suite
├── pyproject.toml
├── requirements.txt
└── .env.example
```

## License

MIT License - See LICENSE file for details
