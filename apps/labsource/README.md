# LabSource - Laboratory & Life Sciences B2B Marketplace

A comprehensive B2B marketplace platform designed specifically for laboratory and life sciences procurement, featuring lot-tracked reagents, cold chain compliance, and grant procurement support.

## Features

- **Lot-Tracked Delivery**: Every reagent ships with Certificate of Analysis (CoA) before delivery
- **Cold Chain Monitoring**: Real-time temperature tracking with instant excursion alerts
- **Grant Compliance**: Built-in NSF/NIH procurement compliance with automatic documentation
- **Substitute Recommendations**: AI-powered alternatives when preferred reagents are backordered
- **CLIA-Waived Products**: Dedicated tracking for clinical laboratory products

## Architecture

### Frontend (React + TypeScript + Vite)

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service layer
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── package.json
```

### Backend (FastAPI + Python 3.12)

```
backend/
├── src/
│   ├── models/          # Pydantic data models
│   ├── routers/         # API route handlers
│   ├── services/        # Business logic services
│   └── main.py          # FastAPI application entry
└── tests/               # Test suite
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- PostgreSQL 15+
- Redis 7+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**
```
ENVIRONMENT=development
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/labsource
REDIS_URL=redis://localhost:6379/0
BASEROW_URL=https://api.baserow.io
BASEROW_TOKEN=your-baserow-token
SALEOR_URL=https://your-saleor-instance.com
SALEOR_TOKEN=your-saleor-token
```

## API Documentation

When running in development mode, API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Schema (Baserow)

### Core Tables

- **USERS**: Buyer and supplier accounts
- **SUPPLIERS**: Supplier organizations and certifications
- **PRODUCTS**: Reagent catalog with specifications
- **LOT_REGISTRY**: Lot tracking with CoA links
- **RFQ_SUBMISSIONS**: Request for quote submissions
- **QUOTES**: Supplier quotes for RFQs
- **ORDERS**: Purchase orders
- **COLD_CHAIN_COMPLIANCE**: Temperature monitoring logs
- **GRANT_PROCUREMENT**: Grant-linked purchases
- **CLIA_REGISTRY**: CLIA-waived product tracking
- **AUDIT_LOG**: System activity logging

## Key Integrations

### Baserow
All data is stored in Baserow with `user_field_names=true` for human-readable field names.

### Saleor
E-commerce functionality including:
- Product catalog management
- Variant tracking (for lots)
- Order processing
- Checkout flow

### CLIA Validation
Validates CLIA numbers against CMS format requirements:
- Format: 2 letters + 7 digits + 1 digit (e.g., AB12345670)
- DOD format: D + 8 digits

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Style

```bash
# Backend formatting
black src/
ruff check src/

# Frontend formatting
npm run lint
```

## Deployment

### Docker

```bash
docker build -t labsource-backend ./backend
docker build -t labsource-frontend ./frontend
docker-compose up -d
```

### Environment-Specific Configuration

- **Development**: Debug mode enabled, detailed error messages
- **Staging**: Production-like with test data
- **Production**: Optimized builds, Sentry monitoring, restricted API docs

## Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- CORS configuration for frontend origin
- Rate limiting on auth endpoints
- Input validation with Pydantic
- SQL injection protection via parameterized queries

## License

MIT License - See LICENSE file for details

## Support

For support, email team@labsource.io or open an issue on GitHub.
