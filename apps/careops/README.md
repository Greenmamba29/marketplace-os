# CareOps - Home Care & Staffing Marketplace

A comprehensive B2B marketplace platform connecting families with qualified, background-checked caregivers for professional home care services.

## Architecture

```
careops/
├── frontend/          # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
│
└── backend/           # FastAPI Python 3.12
    ├── src/
    │   ├── routers/       # API route handlers
    │   ├── services/      # Business logic
    │   ├── models/        # Pydantic models
    │   └── main.py        # Application entry point
    └── tests/             # Test suite
```

## Features

### For Families
- **Caregiver Directory**: Search and filter caregivers by certifications, languages, specializations, ratings, and location
- **Care Plan Builder**: Multi-step wizard to create detailed care plans
- **Family Portal**: Dashboard to monitor care, view schedules, and track activities
- **Scheduling**: Calendar view of upcoming care visits

### For Caregivers
- **Profile Management**: Showcase certifications, experience, and specializations
- **Schedule Management**: View and manage care assignments
- **Clock In/Out**: GPS-enabled time tracking
- **Earnings Tracking**: Monitor completed shifts and earnings

### For Admins
- **Dashboard**: Overview of platform metrics and KPIs
- **Caregiver Management**: Approve/reject caregiver applications
- **Background Checks**: Integration with Checkr and Sterling
- **Payer Authorizations**: Manage insurance authorizations

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom components with Lucide icons

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Authentication**: JWT tokens with python-jose
- **Database**: Baserow (via REST API)
- **Background Checks**: Checkr / Sterling APIs
- **Notifications**: SendGrid (email) / Twilio (SMS)
- **Logging**: Structlog

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- Baserow account (for database)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Run the server
uvicorn src.main:app --reload
```

The API will be available at `http://localhost:8000`

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

#### Backend (.env)
See `backend/.env.example` for all required variables.

Key variables:
- `BASEROW_API_TOKEN` - Your Baserow API token
- `BASEROW_*_TABLE_ID` - Table IDs for each entity
- `SECRET_KEY` - JWT signing key
- `CHECKR_API_KEY` / `STERLING_API_KEY` - Background check providers (optional)

## Baserow Schema

### Required Tables

1. **USERS** - User accounts
   - email, password_hash, first_name, last_name, role, phone, is_active

2. **CAREGIVER_PROFILES** - Caregiver details
   - user_id, certifications, languages, specializations, hourly_rate, bio, availability, rating

3. **CARE_PLANS** - Family care requirements
   - family_id, patient_name, care_type, address, schedule_requirements, care_needs, status

4. **SCHEDULES** - Caregiver assignments
   - care_plan_id, caregiver_id, scheduled_date, start_time, end_time, status

5. **BACKGROUND_CHECKS** - Background check records
   - caregiver_id, provider, status, report_id, checks

6. **PAYER_AUTHORIZATIONS** - Insurance authorizations
   - care_plan_id, payer_type, status, authorized_hours, authorized_hours_used

## API Documentation

When running in development mode, API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

#### Caregivers
- `GET /api/caregivers` - Search caregivers
- `GET /api/caregivers/{id}` - Get caregiver details
- `PATCH /api/caregivers/{id}` - Update caregiver profile

#### Care Plans
- `GET /api/care-plans` - List care plans
- `POST /api/care-plans` - Create care plan
- `GET /api/care-plans/{id}` - Get care plan details
- `POST /api/care-plans/{id}/assign` - Assign caregiver

#### Scheduling
- `GET /api/schedules` - List shifts
- `POST /api/schedules` - Create shift
- `POST /api/schedules/{id}/clock-in` - Clock in
- `POST /api/schedules/{id}/clock-out` - Clock out

#### Admin
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/pending-background-checks` - Pending background checks
- `POST /api/admin/caregivers/{id}/approve` - Approve caregiver

## Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
pytest
```

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

### Backend (Docker)
```bash
docker build -t careops-backend .
docker run -p 8000:8000 --env-file .env careops-backend
```

### Backend (Railway/Render)
1. Connect your repository
2. Set start command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
3. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email team@careops.io or visit our help center.
