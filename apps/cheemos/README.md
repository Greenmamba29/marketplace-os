# ChemOS — Specialty Chemicals B2B Marketplace

> "The intelligence layer for specialty chemicals procurement"  
> Domain: cheemos.io | Primary Color: Teal #0ABFBC | Framework: Saleor + FastAPI

## Architecture

```
Frontend  →  React 18 + TypeScript + Vite + Tailwind (port 80)
Backend   →  FastAPI (Python 3.12) + Pydantic v2 (port 8000)
Primary DB → Neon DB (PostgreSQL) — users, orders, RFQs, quotes, payments
Catalog DB → Baserow — chemical catalog, compliance registry, suppliers
Cache      → Redis
Payments   → Stripe
AI         → Anthropic Claude (compliance reports, ACCIO sourcing)
```

## Neon DB Setup

1. Create a project at [console.neon.tech](https://console.neon.tech)
2. Create a database named `cheemos`
3. Copy the **connection string** (asyncpg format):
   ```
   postgresql+asyncpg://user:pass@ep-xxx.us-east-1.aws.neon.tech/cheemos?sslmode=require
   ```
4. Paste it as `NEON_DATABASE_URL` in your `.env`

Tables created automatically on first boot (or via Alembic):

| Table | Backed by |
|---|---|
| `users` | Neon DB |
| `rfq_submissions` | Neon DB |
| `rfq_items` | Neon DB |
| `quotes` | Neon DB |
| `quote_items` | Neon DB |
| `orders` | Neon DB |
| `payments` | Neon DB |
| `compliance_cache` | Neon DB (hot cache) |
| `audit_log` | Neon DB |
| Chemical catalog | Baserow |
| Compliance registry | Baserow |
| Supplier graph | Baserow |
| Market intelligence | Baserow |

## Quick Deploy

```bash
# 1. Clone / navigate to this directory
cd marketplace-os/apps/cheemos

# 2. Set up environment
cp .env.example .env
# Edit .env — fill in NEON_DATABASE_URL, STRIPE_*, ANTHROPIC_API_KEY, BASEROW_TOKEN

# 3. Deploy
bash deploy.sh
```

The deploy script:
- Builds Docker images
- Runs `alembic upgrade head` against Neon DB
- Starts backend, frontend, redis, celery

## Local Development

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env  # and fill in values
DATABASE_URL="postgresql+asyncpg://localhost/cheemos" uvicorn src.main:app --reload
```

### Run migrations
```bash
cd backend
DATABASE_URL="postgresql+asyncpg://localhost/cheemos" alembic upgrade head

# Generate new migration after model changes:
alembic revision --autogenerate -m "add my table"
```

### Frontend
```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register buyer |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/chemicals` | Chemical catalog |
| GET | `/api/chemicals/cas/:cas` | Lookup by CAS |
| GET | `/api/rfq` | List my RFQs |
| POST | `/api/rfq` | Create RFQ |
| GET | `/api/quotes` | List quotes |
| POST | `/api/quotes/:id/accept` | Accept → creates order |
| POST | `/api/orders/:id/payment-intent` | Create Stripe PaymentIntent |
| POST | `/api/orders/webhook/stripe` | Stripe webhook |
| GET | `/api/compliance/cas/:cas` | Compliance record |
| POST | `/api/compliance/ai-report` | AI compliance report |
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/docs` | Swagger UI (DEBUG mode) |

## Revenue Model

| Stream | Take Rate | Year 3 Target |
|---|---|---|
| Managed spread | 18–22% | $14M |
| Compliance-as-a-Service | $500/order | $3.6M |
| Supply chain financing | 3% fee | $2.2M |
| Price index subscription | $2,500/mo | $1.2M |
| AI compliance reports | variable | $800K |

## CI/CD

GitHub Actions at `.github/workflows/deploy.yml`:
1. Test backend (pytest) + frontend (tsc + build)
2. Build & push Docker images to GHCR
3. Run Alembic migrations against Neon DB
4. SSH deploy to production server

### Required GitHub Secrets

```
NEON_DATABASE_URL      postgresql+asyncpg://...neon.tech/cheemos?sslmode=require
VITE_API_URL           https://api.cheemos.io
DEPLOY_HOST            your-server-ip
DEPLOY_USER            ubuntu
DEPLOY_SSH_KEY         -----BEGIN OPENSSH PRIVATE KEY-----...
```
