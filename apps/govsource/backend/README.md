# GovSource Backend

Government Procurement Marketplace - FastAPI Backend

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Vendor Management**: Complete vendor profiles with SAM.gov integration
- **RFP/RFQ Management**: Full procurement workflow support
- **Compliance Tracking**: FAR/DFARS compliance monitoring
- **Set-Aside Programs**: 8(a), HUBZone, SDVOSB, WOSB tracking
- **SAM.gov Integration**: Real-time entity verification

## Quick Start

### Prerequisites

- Python 3.12+
- pip or uv

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Or install with development dependencies
pip install -e ".[dev]"
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `SECRET_KEY`: JWT signing key
- `BASEROW_TOKEN`: Baserow API token
- `SAM_GOV_API_KEY`: SAM.gov API key

### Running the Server

```bash
# Development mode with auto-reload
python -m src.main

# Or using uvicorn directly
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Running Tests

```bash
pytest
```

## API Documentation

When running in debug mode, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── models/              # Pydantic models
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── vendor.py
│   │   ├── rfp.py
│   │   ├── rfq.py
│   │   ├── compliance.py
│   │   └── common.py
│   ├── routers/             # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── vendors.py
│   │   ├── rfps.py
│   │   ├── rfqs.py
│   │   ├── compliance.py
│   │   └── admin.py
│   └── services/            # Business logic services
│       ├── __init__.py
│       ├── baserow.py
│       ├── samgov.py
│       └── auth.py
├── tests/                   # Test suite
├── pyproject.toml
├── requirements.txt
└── .env.example
```

## Baserow Schema

The following tables should be created in Baserow:

1. **USERS** - User accounts
2. **VENDORS** - Vendor profiles
3. **VENDOR_QUALIFICATIONS** - Vendor qualifications
4. **RFP_REGISTRY** - RFP records
5. **RFQ_SUBMISSIONS** - RFQ records
6. **QUOTES** - Vendor quotes
7. **ORDERS** - Purchase orders
8. **FAR_COMPLIANCE** - FAR clause compliance
9. **DFARS_COMPLIANCE** - DFARS clause compliance
10. **SET_ASIDE_TRACKING** - Set-aside eligibility
11. **COMPLIANCE_RECORDS** - General compliance
12. **AUDIT_LOG** - Activity audit log

## License

MIT License
