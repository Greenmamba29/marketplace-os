# AgroOps - Agricultural Inputs Marketplace

A comprehensive B2B marketplace platform for agricultural inputs, connecting farmers with verified suppliers for seeds, fertilizers, crop protection products, and equipment.

## Features

### Core Functionality
- **Input Directory**: Browse 15,000+ verified agricultural products
- **Agronomic Engine**: AI-powered input recommendations based on crop, soil, and weather
- **RFQ Platform**: Request quotes from multiple suppliers simultaneously
- **EPA Compliance**: Real-time state-by-state registration verification
- **Ag Credit Terms**: Net-90 seasonal payment terms for farmers
- **Market Intelligence**: Weather-adjusted demand forecasting and price trends

### Specialized Agricultural Features
- Active ingredient tracking with EPA registration numbers
- Formulation types (EC, SC, WG, granular, liquid)
- Application timing and crop compatibility
- PHI (Pre-Harvest Interval) and REI (Re-Entry Interval) data
- N-P-K ratios for fertilizers
- Growing Degree Days (GDD) tracking
- State registration compliance verification

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **UI Components**: Headless UI + Lucide Icons

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Authentication**: JWT tokens with refresh
- **Database**: Baserow (via API)
- **E-commerce**: Medusa.js integration
- **External APIs**: EPA, NOAA Weather

## Project Structure

```
agroops/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   ├── types/         # TypeScript types
│   │   └── lib/           # Utility functions
│   ├── public/            # Static assets
│   └── package.json
│
├── backend/               # FastAPI backend
│   ├── src/
│   │   ├── routers/       # API route handlers
│   │   ├── services/      # External service integrations
│   │   ├── models/        # Pydantic models
│   │   └── config.py      # Configuration
│   ├── tests/             # Test suite
│   └── requirements.txt
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

The backend API will be available at `http://localhost:8000`

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Frontend (.env)**:
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_MEDUSA_URL=http://localhost:9000
VITE_BASEROW_URL=https://api.baserow.io
```

**Backend (.env)**:
```
DEBUG=true
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/agroops
BASEROW_TOKEN=your-baserow-token
BASEROW_DATABASE_ID=your-database-id
MEDUSA_URL=http://localhost:9000
MEDUSA_API_KEY=your-medusa-key
WEATHER_API_KEY=your-weather-api-key
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh access token

### Inputs
- `GET /api/v1/inputs` - List inputs with filters
- `GET /api/v1/inputs/featured` - Get featured inputs
- `GET /api/v1/inputs/{id}` - Get input by ID
- `GET /api/v1/inputs/{id}/registration/{state}` - Check state registration

### Agronomy
- `GET /api/v1/agronomy/crops` - List available crops
- `GET /api/v1/agronomy/crops/{id}` - Get crop details
- `POST /api/v1/agronomy/recommendations` - Get input recommendations
- `GET /api/v1/agronomy/weather` - Get weather forecast
- `GET /api/v1/agronomy/gdd` - Get Growing Degree Days

### RFQ
- `GET /api/v1/rfq` - List RFQs
- `POST /api/v1/rfq` - Create new RFQ
- `GET /api/v1/rfq/{id}` - Get RFQ by ID
- `PATCH /api/v1/rfq/{id}` - Update RFQ
- `POST /api/v1/rfq/{id}/publish` - Publish RFQ
- `POST /api/v1/rfq/{id}/cancel` - Cancel RFQ
- `POST /api/v1/rfq/{id}/award` - Award RFQ to quote

### Quotes
- `GET /api/v1/quotes` - List quotes
- `POST /api/v1/quotes/rfq/{rfq_id}` - Submit quote
- `GET /api/v1/quotes/{id}` - Get quote by ID

### Admin
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/suppliers` - List all suppliers
- `POST /api/v1/admin/suppliers/{id}/verify` - Verify supplier
- `GET /api/v1/admin/analytics` - Get platform analytics
- `POST /api/v1/admin/epa/sync` - Sync EPA registrations

## Baserow Schema

### Core Tables
- **USERS**: User accounts and authentication
- **SUPPLIERS**: Supplier company information
- **PRODUCTS**: Agricultural input products
- **RFQ_SUBMISSIONS**: RFQ requests from buyers
- **QUOTES**: Supplier responses to RFQs
- **ORDERS**: Confirmed purchases
- **PAYMENTS**: Payment records
- **COMPLIANCE_RECORDS**: EPA and regulatory data
- **AUDIT_LOG**: Platform activity log

### Agricultural Tables
- **CROP_REGISTRY**: Crop types and growing information
- **EPA_REGISTRATIONS**: EPA registration data by state
- **WEATHER_INTEGRATION**: Weather data cache
- **SEASONAL_FORECASTS**: Market forecasts and predictions

## Design System

### Colors
- **Primary**: Field Gold (#D97706)
- **Secondary**: Crop Green (#059669)
- **Accent**: Sky Blue (#0EA5E9)
- **Background**: Dark (#0F0F0F, #1A1A1A)
- **Text**: White (#FFFFFF), Gray (#9CA3AF)

### Typography
- **Display**: Syne (headings)
- **Body**: DM Sans (content)
- **Mono**: JetBrains Mono (data)

### Components
- Cards with 0.5px borders
- Pill-shaped status badges
- Flat surfaces (no gradients)
- Consistent 8px spacing scale

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@agroops.io or visit our help center at https://agroops.io/help

---

Built with ❤️ for the agricultural community
