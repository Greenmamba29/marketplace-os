# LithiumBuy Marketplace

A global B2B marketplace for lithium materials with live price indexing, IRA-compliant sourcing, and secure contract management.

## Project Structure

```
lithiumbuy/
├── frontend/          # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── lib/           # Utility functions
│   └── public/            # Static assets
└── backend/           # FastAPI Python 3.12
    ├── src/
    │   ├── models/        # Pydantic models
    │   ├── routers/       # API routes
    │   ├── services/      # Business logic
    │   └── config.py      # Configuration
    └── tests/             # Test suite
```

## Features

### Frontend
- **Live Price Index**: Real-time lithium pricing data with Bloomberg-style charts
- **Material Directory**: Browse verified lithium materials with detailed specs
- **RFQ Wizard**: Multi-step form for submitting request for quotations
- **Contract Manager**: Manage spot and long-term contracts
- **Buyer Dashboard**: Track RFQs, quotes, orders, and contracts
- **Admin Dashboard**: Platform management and market intelligence

### Backend
- **Authentication**: JWT-based auth with role-based access control
- **Pricing Engine**: Live price calculation and historical data
- **Baserow Integration**: All data stored in Baserow with user_field_names
- **Spot Feeds**: Integration with external price sources (ACCIO)
- **Market Intelligence**: Supply alerts and geopolitical risk assessment

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- Redis (optional, for caching)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn src.main:app --reload
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```
DEBUG=false
SECRET_KEY=your-secret-key
BASEROW_URL=https://api.baserow.io
BASEROW_TOKEN=your-token
BASEROW_DATABASE_ID=your-database-id
# ... see .env.example for all options
```

## Baserow Schema

### Required Tables
- **USERS**: User accounts and authentication
- **SUPPLIERS**: Verified supplier profiles
- **PRODUCTS**: Lithium materials with specs
- **RFQ_SUBMISSIONS**: Buyer RFQs
- **QUOTES**: Supplier quotes
- **ORDERS**: Confirmed orders
- **CONTRACTS**: Long-term agreements
- **SPOT_PRICE_HISTORY**: Daily price data
- **MINES**: Producing mine registry
- **ALERTS**: Supply tightness alerts

## API Documentation

When running in development mode, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

### Frontend
```bash
cd frontend
npm run typecheck
npm run lint
```

### Backend
```bash
cd backend
pytest
```

## License

MIT License - See LICENSE file for details
