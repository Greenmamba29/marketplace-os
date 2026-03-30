# MRODirect Backend API

Industrial MRO Parts Marketplace Backend built with FastAPI.

## Features

- **Authentication**: JWT-based auth with refresh tokens
- **Product Catalog**: 500K+ SKU support with part number search
- **RFQ System**: Multi-step RFQ wizard with emergency sourcing
- **Quote Management**: Supplier quote submission and acceptance
- **Order Tracking**: Full order lifecycle management
- **Machine Registry**: Equipment management with compatible parts
- **Market Intelligence**: Price trends and substitute recommendations
- **Admin Dashboard**: Supplier verification and platform management

## Tech Stack

- **Framework**: FastAPI
- **Python**: 3.12+
- **Database**: Baserow (via REST API)
- **Authentication**: JWT with python-jose
- **Payments**: Stripe
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

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

### Running

```bash
# Development
uvicorn src.main:app --reload

# Production
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

### API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Settings and configuration
│   ├── models/              # Pydantic models
│   │   ├── __init__.py
│   │   ├── common.py
│   │   ├── user.py
│   │   ├── part.py
│   │   ├── machine.py
│   │   ├── rfq.py
│   │   ├── quote.py
│   │   ├── order.py
│   │   └── supplier.py
│   ├── routers/             # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── rfq.py
│   │   ├── quotes.py
│   │   ├── orders.py
│   │   └── admin.py
│   └── services/            # Business logic
│       ├── __init__.py
│       ├── baserow.py       # Baserow integration
│       ├── auth.py          # Authentication service
│       ├── stripe.py        # Payment processing
│       └── intelligence.py  # AI/ML recommendations
├── tests/                   # Test suite
├── .env.example
├── pyproject.toml
├── requirements.txt
└── README.md
```

## Baserow Schema

### Required Tables

1. **USERS** - Buyer and supplier accounts
2. **SUPPLIERS** - Supplier profiles and verification status
3. **PARTS_CATALOG** - Product catalog (500K+ rows)
4. **MACHINE_REGISTRY** - Buyer equipment list
5. **SUPPLIER_CONTRACTS** - Tiered pricing contracts
6. **RFQ_SUBMISSIONS** - RFQ data
7. **QUOTES** - Supplier quotes
8. **ORDERS** - Purchase orders
9. **PAYMENTS** - Payment records
10. **COMPLIANCE_RECORDS** - Certifications and audits
11. **AUDIT_LOG** - Platform activity log

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update profile

### Products
- `GET /api/parts` - List parts
- `GET /api/parts/search` - Search by part number
- `GET /api/parts/by-machine` - Parts by machine
- `GET /api/parts/{id}` - Get part details
- `GET /api/parts/{id}/suppliers` - Part suppliers
- `GET /api/parts/{id}/substitutes` - Substitute recommendations

### RFQ
- `GET /api/rfq` - List RFQs
- `POST /api/rfq` - Create RFQ
- `GET /api/rfq/{id}` - Get RFQ
- `PATCH /api/rfq/{id}` - Update RFQ
- `POST /api/rfq/{id}/cancel` - Cancel RFQ
- `POST /api/rfq/emergency` - Emergency sourcing

### Quotes
- `GET /api/quotes` - List quotes
- `GET /api/quotes/{id}` - Get quote
- `POST /api/quotes/{id}/accept` - Accept quote
- `POST /api/quotes/{id}/reject` - Reject quote

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/{id}` - Get order
- `PATCH /api/orders/{id}/status` - Update status
- `POST /api/orders/{id}/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/users` - List users
- `GET /api/admin/suppliers` - List suppliers
- `POST /api/admin/suppliers/{id}/verify` - Verify supplier
- `GET /api/admin/market-intel/insights` - Market insights

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_auth.py
```

## License

MIT License
