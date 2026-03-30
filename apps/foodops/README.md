# FoodOps - Commercial Food Distribution Platform

A complete B2B marketplace for commercial food distribution with menu-based procurement, AI demand forecasting, FSMA lot traceability, and cold chain monitoring.

## Features

### Core Platform
- **Menu-Based Procurement**: Generate purchase orders directly from menu items and recipes
- **AI Demand Forecasting**: Predict weekly ingredient usage with machine learning
- **FSMA Lot Traceability**: Full FDA FSMA 204 compliance with one-click lot tracing
- **Cold Chain Monitoring**: Real-time temperature tracking with automatic alerts
- **Allergen Management**: Comprehensive allergen tracking and cross-contamination prevention
- **Expiry Management**: FIFO inventory rotation with expiry date tracking

### Product Properties
- GTIN/UPC codes
- Food safety categories (RTE vs raw)
- Allergen flags
- Certifications (organic, kosher, halal)
- Temperature zones (frozen/refrigerated/ambient)
- Days to expiry minimum
- Origin location
- Nutrition Facts

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS
- Zustand state management
- TanStack Query (React Query)
- React Router
- Recharts for data visualization

### Backend
- FastAPI (Python 3.12)
- Pydantic for data validation
- JWT authentication
- Baserow integration
- Redis for caching
- Celery for background tasks

## Project Structure

```
foodops/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   └── types/         # TypeScript types
│   └── public/
└── backend/           # FastAPI Python 3.12
    ├── src/
    │   ├── routers/       # API route handlers
    │   ├── services/      # Business logic services
    │   ├── models/        # Pydantic models
    │   └── main.py        # Application entry point
    └── tests/
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL (optional, for local development)
- Redis (optional, for caching)

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

**Backend `.env`:**
```env
DEBUG=true
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/foodops
BASEROW_API_TOKEN=your-baserow-token
REDIS_URL=redis://localhost:6379/0
```

## API Documentation

When running in development mode, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Baserow Tables

The following tables should be configured in Baserow:

- **USERS**: User accounts and authentication
- **SUPPLIERS**: Supplier profiles and information
- **PRODUCTS**: Ingredient/product catalog
- **RFQ_SUBMISSIONS**: Request for quote submissions
- **QUOTES**: Supplier quotes
- **ORDERS**: Purchase orders
- **MENU_ENGINEERING**: Menu items and recipes
- **LOT_TRACKING**: FSMA lot traceability records
- **ALLERGEN_REGISTRY**: Allergen information
- **TEMPERATURE_LOGS**: Cold chain temperature readings

## License

MIT License - see LICENSE file for details

## Support

For support, email team@foodops.io or join our Slack community.
