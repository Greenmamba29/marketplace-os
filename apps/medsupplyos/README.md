# MedSupplyOS - Healthcare Equipment & MRO Marketplace

A comprehensive B2B marketplace for healthcare equipment procurement with FDA compliance, UDI tracking, and GPO benchmarking.

## Features

### Core Capabilities
- **UDI Compliance**: Full FDA Unique Device Identifier tracking with GS1-128 and DataMatrix support
- **FDA Verification**: Real-time FDA clearance verification on every order with automatic recall detection
- **GPO Benchmarking**: Compare pricing across all major GPOs and identify savings opportunities
- **Emergency Sourcing**: Critical care equipment sourcing with 24/7 availability
- **Account Hierarchies**: Multi-level organization support from health systems to departments

### Healthcare-Specific Features
- FDA device class tracking (Class I/II/III)
- Sterility indicators and cold chain requirements
- Lot tracking and expiration date management
- Clinical approval workflows
- Biomedical asset management with maintenance scheduling

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite build system
- Tailwind CSS for styling
- TanStack Query for data fetching
- Zustand for state management
- React Hook Form + Zod for forms

### Backend
- FastAPI (Python 3.12)
- JWT authentication
- Baserow integration for data storage
- FDA API integration
- Prometheus metrics
- Sentry error tracking

## Project Structure

```
medsupplyos/
├── frontend/          # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
└── backend/           # FastAPI Python 3.12
    ├── src/
    │   ├── routers/       # API route handlers
    │   ├── services/      # Business logic services
    │   ├── models/        # Pydantic models
    │   └── config.py      # Configuration
    └── tests/             # Test suite
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- Baserow account

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
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run development server
uvicorn src.main:app --reload
```

### Environment Variables

```env
# Application
APP_NAME=MedSupplyOS
APP_VERSION=1.0.0
DEBUG=false
ENVIRONMENT=development

# Security
SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Baserow
BASEROW_URL=https://api.baserow.io
BASEROW_TOKEN=your-baserow-token
BASEROW_DATABASE_ID=your-database-id

# FDA API
FDA_API_URL=https://api.fda.gov
FDA_API_KEY=your-fda-api-key

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

## Baserow Schema

### Tables Required

1. **users** - User accounts and authentication
2. **suppliers** - Supplier/vendor information
3. **equipment** - Medical equipment catalog
4. **facilities** - Hospital/clinic registry
5. **departments** - Department structure
6. **rfq_submissions** - RFQ requests
7. **quotes** - Supplier quotes
8. **orders** - Purchase orders
9. **gpo_contracts** - GPO pricing contracts
10. **biomedical_equipment** - Installed asset tracking
11. **regulatory_clearances** - FDA clearances
12. **audit_log** - System audit trail

## API Documentation

When running in development mode, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Equipment
- `GET /api/v1/equipment` - List equipment
- `GET /api/v1/equipment/{id}` - Get equipment details
- `GET /api/v1/equipment/{id}/fda-verify` - Verify FDA clearance

### UDI Tracking
- `GET /api/v1/equipment/udi/scan/{udi}` - Scan UDI
- `POST /api/v1/equipment/udi/{udi}/movement` - Record movement
- `GET /api/v1/equipment/udi/{udi}/history` - Get movement history

### RFQ
- `GET /api/v1/rfq` - List RFQs
- `POST /api/v1/rfq` - Create RFQ
- `POST /api/v1/rfq/{id}/submit` - Submit for approval
- `POST /api/v1/rfq/{id}/approve-clinical` - Clinical approval
- `POST /api/v1/rfq/{id}/approve-budget` - Budget approval

### Orders
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/{id}` - Get order details
- `POST /api/v1/orders/{id}/receive` - Receive items

### GPO
- `GET /api/v1/gpo` - List GPOs
- `GET /api/v1/gpo/benchmark/{equipment_id}` - Price benchmark
- `POST /api/v1/gpo/compare` - Compare prices

## License

MIT License - See LICENSE file for details

## Support

For support, contact team@medsupplyos.io
