# BarrelHub

The premier B2B marketplace for bulk whiskey and spirits.

## Overview

BarrelHub connects distilleries, brokers, and buyers in a trusted platform for trading aged barrels. With individual barrel tracking, TTB compliance verification, and real-time market intelligence, BarrelHub brings transparency and efficiency to the bulk spirits market.

## Features

- **Individual Barrel Tracking**: Every barrel tracked by unique number, entry date, and complete lifecycle history
- **TTB Compliance**: Automated permit verification and compliance documentation
- **Sensory Profiles**: Professional tasting notes and evaluation scores
- **Market Intelligence**: Real-time comparable transactions and pricing trends
- **RFQ System**: Streamlined request-for-quote workflow
- **Age Projections**: Track aging progress with angel's share calculations

## Architecture

```
barrelhub/
├── frontend/          # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── public/
└── backend/           # FastAPI + Python 3.12
    ├── src/
    │   ├── routers/       # API route handlers
    │   ├── models/        # Pydantic models
    │   └── services/      # Business logic
    └── tests/
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- Baserow account (for database)

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
source venv/bin/activate
pip install -r requirements.txt
# Configure .env file
cp .env.example .env
python -m barrelhub_backend.main
```

## Documentation

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

## Environment Variables

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

### Backend

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | JWT signing key |
| `BASEROW_API_KEY` | Baserow API key |
| `BASEROW_DATABASE_ID` | Baserow database ID |

## API Endpoints

See [Backend README](backend/README.md) for full API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Contact

- Email: hello@barrelhub.io
- Website: https://barrelhub.io
