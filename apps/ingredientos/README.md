# IngredientOS

**The Premier B2B Marketplace for Specialty Food & Beverage Ingredients**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-00a393.svg)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)

## Overview

IngredientOS is a comprehensive B2B marketplace platform designed specifically for the specialty food and beverage ingredients industry. It combines powerful regulatory compliance features with a seamless procurement experience.

### Key Features

- **Complete Regulatory Compliance**: GRAS verification, certification tracking, allergen management
- **Verified Supplier Network**: All suppliers vetted with complete documentation
- **Advanced Search & Filtering**: Find ingredients by regulatory status, certifications, and more
- **RFQ System**: Request quotes with specific compliance requirements
- **Order Management**: End-to-end tracking with documentation
- **Real-time Compliance Alerts**: Stay informed about certification expirations

### Compliance Features

| Feature | Description |
|---------|-------------|
| GRAS Verification | FDA GRAS database integration with notification tracking |
| Certification Tracking | Organic, Non-GMO, Kosher, Halal certification management |
| Allergen Management | FALCPA-compliant allergen declarations |
| Functional Claims | Structure-function claim documentation |
| Food Defense | FSMA compliance documentation |

## Architecture

```
ingredientos/
├── frontend/          # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand state management
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
│
└── backend/           # FastAPI Python 3.12
    ├── src/
    │   ├── routers/         # API route handlers
    │   ├── models/          # Pydantic models
    │   ├── services/        # Business logic services
    │   └── config.py        # Configuration settings
    └── tests/               # Test suite
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Authentication**: JWT with python-jose
- **Data Validation**: Pydantic v2
- **HTTP Client**: httpx
- **Database**: Baserow (via REST API)
- **E-commerce**: Saleor (GraphQL API)
- **Retry Logic**: tenacity

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm or yarn
- Baserow account (for data storage)
- Saleor instance (optional, for e-commerce features)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```env
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=your-secret-key-here
BASEROW_API_URL=https://api.baserow.io
BASEROW_TOKEN=your-baserow-token
BASEROW_DATABASE_ID=your-database-id
SALEOR_API_URL=https://your-saleor-instance.com/graphql/
SALEOR_TOKEN=your-saleor-token
```

5. Run the development server:
```bash
python -m src.main
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Documentation

When running in development mode, API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/auth/login` | User login |
| `GET /api/v1/ingredients` | List ingredients |
| `GET /api/v1/ingredients/{id}` | Get ingredient details |
| `GET /api/v1/regulatory/gras/{id}` | Get GRAS status |
| `POST /api/v1/rfq` | Create RFQ |
| `GET /api/v1/admin/stats` | Platform statistics |

## Baserow Schema

The following tables should be created in Baserow:

### USERS
- email (text)
- name (text)
- company_name (text)
- role (single_select: buyer, supplier, admin)
- verified (boolean)
- password_hash (text)

### SUPPLIERS
- name (text)
- description (long_text)
- website (url)
- country (text)
- certifications (multiple_select)
- years_in_business (number)
- verified (boolean)
- rating (number)
- contact_email (email)

### PRODUCTS
- name (text)
- description (long_text)
- category (single_select)
- supplier (link to SUPPLIERS)
- price_per_kg (number)
- moq_kg (number)
- specifications (json)
- regulatory_status (json)
- country_of_origin (text)
- status (single_select)

### REGULATORY_STATUS
- ingredient_id (link to PRODUCTS)
- status (single_select: gras, nda, pending, not_submitted)
- fdn_number (text)
- notification_date (date)
- fda_response (single_select)
- self_affirmed (boolean)

### CERTIFICATIONS
- ingredient_id (link to PRODUCTS)
- name (text)
- type (single_select)
- issuer (text)
- certificate_number (text)
- issue_date (date)
- expiry_date (date)
- status (single_select)
- verified (boolean)

### ALLERGEN_PROFILES
- ingredient_id (link to PRODUCTS)
- contains_major_allergens (boolean)
- major_allergens (multiple_select)
- may_contain (multiple_select)
- allergen_statement (long_text)
- fda_compliant (boolean)

### FUNCTIONAL_CLAIMS
- ingredient_id (link to PRODUCTS)
- claim (text)
- claim_type (single_select)
- regulatory_status (single_select)
- substantiation_documents (json)

### RFQ_SUBMISSIONS
- buyer_id (link to USERS)
- title (text)
- description (long_text)
- ingredient_category (single_select)
- quantity_kg (number)
- delivery_timeline (text)
- required_certifications (multiple_select)
- status (single_select)

### QUOTES
- rfq_id (link to RFQ_SUBMISSIONS)
- supplier_id (link to SUPPLIERS)
- unit_price (number)
- total_price (number)
- lead_time_days (number)
- status (single_select)
- selected (boolean)

### ORDERS
- quote_id (link to QUOTES)
- buyer_id (link to USERS)
- supplier_id (link to SUPPLIERS)
- ingredient_id (link to PRODUCTS)
- quantity_kg (number)
- total_amount (number)
- status (single_select)
- payment_status (single_select)

## Testing

### Backend Tests

```bash
cd backend
pytest
```

Run with coverage:
```bash
pytest --cov=src --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Deployment

### Docker (Recommended)

A `docker-compose.yml` file is provided for easy deployment:

```bash
docker-compose up -d
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ENVIRONMENT` | development/production | Yes |
| `SECRET_KEY` | JWT signing key | Yes |
| `BASEROW_TOKEN` | Baserow API token | Yes |
| `BASEROW_DATABASE_ID` | Baserow database ID | Yes |
| `SALEOR_TOKEN` | Saleor API token | No |
| `SENTRY_DSN` | Sentry error tracking | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@ingredientos.io or join our Slack channel.

## Acknowledgments

- FDA for providing the GRAS Notice Inventory
- Non-GMO Project for certification standards
- USDA for organic certification guidelines
