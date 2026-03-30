# Marketplace OS
## 20 B2B Marketplaces — Harvard-Grade Software Stack

A portfolio of 20 vertical-specific B2B managed marketplaces built on a shared infrastructure stack.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MARKETPLACE OS                                    │
│                    20 B2B Vertical Marketplaces                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  MRODirect  │  │   ChemOS    │  │ BuildSource │  │ MedSupplyOS │        │
│  │   (#1)      │  │   (#2)      │  │   (#3)      │  │   (#4)      │        │
│  │  Medusa.js  │  │   Saleor    │  │  Medusa.js  │  │ OroCommerce │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  VoltSource │  │  LithiumBuy │  │   FoodOps   │  │  PackSource │        │
│  │   (#5)      │  │   (#6)      │  │   (#7)      │  │   (#8)      │        │
│  │   Saleor    │  │Saleor+Custom│  │  Medusa.js  │  │  Medusa.js  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   AgroOps   │  │   LabSource │  │   RigSource │  │   CareOps   │        │
│  │   (#9)      │  │   (#10)     │  │   (#11)     │  │   (#12)     │        │
│  │  Medusa.js  │  │   Saleor    │  │ OroCommerce │  │Baserow+Softr│        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   GovSource │  │  SurplusOS  │  │   NetSource │  │ SecureSource│        │
│  │   (#13)     │  │   (#14)     │  │   (#15)     │  │   (#16)     │        │
│  │ OroCommerce │  │Medusa+Custom│  │   Saleor    │  │Baserow+Medus│        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   UniformOS │  │  WorkspaceOS│  │ IngredientOS│  │   BarrelHub │        │
│  │   (#17)     │  │   (#18)     │  │   (#19)     │  │   (#20)     │        │
│  │  Medusa.js  │  │ OroCommerce │  │   Saleor    │  │Baserow+Softr│        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SHARED INFRASTRUCTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │     Baserow     │  │      n8n        │  │     Redis       │             │
│  │  (Database)     │  │ (Automation)    │  │    (Cache)      │             │
│  │  Port: 8080     │  │  Port: 5678     │  │  Port: 6379     │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  PostgreSQL     │  │   Meilisearch   │  │   Prometheus    │             │
│  │  (Medusa DB)    │  │    (Search)     │  │   (Metrics)     │             │
│  │  Port: 5432     │  │  Port: 7700     │  │  Port: 9090     │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │     Grafana     │  │     Nginx       │                                  │
│  │ (Dashboards)    │  │  (Reverse Proxy)│                                  │
│  │  Port: 3000     │  │  Port: 80/443   │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The 20 Marketplaces

| # | Name | Domain | Framework | Vertical | Projected GMV |
|---|------|--------|-----------|----------|---------------|
| 1 | **MRODirect** | mrodirect.io | Medusa.js | Industrial MRO | $85M |
| 2 | **ChemOS** | cheemos.io | Saleor | Specialty Chemicals | $72M |
| 3 | **BuildSource** | buildsource.io | Medusa.js | Construction Materials | $68M |
| 4 | **MedSupplyOS** | medsupplyos.io | OroCommerce | Healthcare Equipment | $61M |
| 5 | **VoltSource** | voltsource.io | Saleor | EV & Clean Energy | $54M |
| 6 | **LithiumBuy** | lithiumbuy.com | Saleor+Custom | Lithium Materials | $48M |
| 7 | **FoodOps** | foodops.io | Medusa.js | Food Distribution | $44M |
| 8 | **PackSource** | packsource.io | Medusa.js | Packaging Materials | $38M |
| 9 | **AgroOps** | agroops.io | Medusa.js | Agri-Inputs | $33M |
| 10 | **LabSource** | labsource.io | Saleor | Laboratory Supplies | $28M |
| 11 | **RigSource** | rigsource.io | OroCommerce | Heavy Equipment | $26M |
| 12 | **CareOps** | careops.io | Baserow+Softr | Home Care Staffing | $22M |
| 13 | **GovSource** | govsource.io | OroCommerce | Government Procurement | $20M |
| 14 | **SurplusOS** | surplusos.io | Medusa+Custom | Surplus Assets | $18M |
| 15 | **NetSource** | netsource.io | Saleor | Network Hardware | $16M |
| 16 | **SecureSource** | securesource.io | Baserow+Medusa | Security Systems | $13M |
| 17 | **UniformOS** | uniformos.io | Medusa.js | B2B Uniforms | $11M |
| 18 | **WorkspaceOS** | workspaceos.io | OroCommerce | Office Furniture | $9M |
| 19 | **IngredientOS** | ingredientos.io | Saleor | Food Ingredients | $8M |
| 20 | **BarrelHub** | barrelhub.io | Baserow+Softr | Bulk Spirits | $6M |

**Total Portfolio GMV (Year 3): $680M**

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **TanStack Query** for data fetching
- **Zustand** for state management

### Backend
- **FastAPI** (Python 3.12)
- **Pydantic v2** for validation
- **JWT** authentication
- **httpx** for external APIs

### Commerce Engines
- **Medusa.js** - SKU-intensive physical goods (8 marketplaces)
- **Saleor** - Attribute-rich products (6 marketplaces)
- **OroCommerce** - Enterprise B2B (4 marketplaces)
- **Baserow + Softr** - Service marketplaces (2 marketplaces)

### Data Layer
- **Baserow** - Primary operational database (all marketplaces)
- **PostgreSQL** - Commerce framework databases
- **Redis** - Cache & session store
- **Meilisearch** - Search engine

### Automation & Intelligence
- **n8n** - Workflow automation
- **Firecrawl** - Web scraping
- **Perplexity Sonar** - Market intelligence
- **Claude API** - AI analysis
- **ACCIO Work** - Autonomous sourcing

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.12+

### 1. Clone and Setup
```bash
git clone <repository>
cd marketplace-os
cp .env.example .env
# Edit .env with your API keys
```

### 2. Start Infrastructure
```bash
docker-compose -f infrastructure/docker-compose.yml up -d
```

This starts:
- Baserow (http://localhost:8080)
- n8n (http://localhost:5678)
- Redis
- PostgreSQL databases
- Meilisearch
- Prometheus & Grafana

### 3. Start a Marketplace
```bash
# Example: Start ChemOS
cd apps/cheemos/frontend && npm install && npm run dev
cd apps/cheemos/backend && pip install -r requirements.txt && uvicorn src.main:app --reload
```

---

## Project Structure

```
marketplace-os/
├── apps/                       # Individual marketplace applications
│   ├── mrodirect/             # #1 Industrial MRO
│   ├── cheemos/               # #2 Specialty Chemicals
│   ├── buildsource/           # #3 Construction Materials
│   ├── medsupplyos/           # #4 Healthcare Equipment
│   ├── voltsource/            # #5 EV & Clean Energy
│   ├── lithiumbuy/            # #6 Lithium Materials
│   ├── foodops/               # #7 Food Distribution
│   ├── packsource/            # #8 Packaging Materials
│   ├── agroops/               # #9 Agri-Inputs
│   ├── labsource/             # #10 Laboratory Supplies
│   ├── rigsource/             # #11 Heavy Equipment
│   ├── careops/               # #12 Home Care Staffing
│   ├── govsource/             # #13 Government Procurement
│   ├── surplusos/             # #14 Surplus Assets
│   ├── netsource/             # #15 Network Hardware
│   ├── securesource/          # #16 Security Systems
│   ├── uniformos/             # #17 B2B Uniforms
│   ├── workspaceos/           # #18 Office Furniture
│   ├── ingredientos/          # #19 Food Ingredients
│   └── barrelhub/             # #20 Bulk Spirits
│
├── packages/                   # Shared packages
│   ├── shared-ui/             # React design system
│   ├── shared-types/          # TypeScript interfaces
│   ├── shared-api/            # FastAPI middleware
│   └── shared-intelligence/   # AI/data integrations
│
├── infrastructure/             # Docker & deployment
│   ├── docker-compose.yml     # Full stack orchestration
│   ├── nginx/                 # Reverse proxy config
│   ├── prometheus/            # Metrics collection
│   └── grafana/               # Dashboards
│
└── docs/                       # Documentation
    ├── prd/                   # Product requirements
    └── api/                   # API documentation
```

---

## Design System

All 20 marketplaces share a unified design system:

### Colors
- **Void**: `#080C14` - Primary background
- **Surface**: `#0F1623` - Card backgrounds
- **Elevated**: `#162032` - Hover states
- **Border**: `#1E2D45` - Borders
- **Teal**: `#0ABFBC` - Primary action color
- **White**: `#F8FAFC` - Primary text

### Typography
- **Syne** - Display/headlines
- **DM Sans** - Body text
- **JetBrains Mono** - Numbers, code, identifiers

### Principles
- Dark-first UI
- No gradients, no shadows
- Flat surfaces with 0.5px borders
- Pill-shaped status badges (monospace, uppercase)

---

## Baserow Integration Rules

1. **Always use `?user_field_names=true`** on all API calls
2. **Use Link to Table fields** for relationships (never plain text IDs)
3. **Create dedicated API tokens** per integration
4. **Write to AUDIT_LOG** as the last step of every automation
5. **AUDIT_LOG is append-only** - never update or delete rows

---

## Data Intelligence Pipeline

Every marketplace connects to the shared intelligence stack:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Firecrawl  │───▶│    n8n      │───▶│   Baserow   │
│  (Scrape)   │    │ (Orchestrate)│    │  (Store)    │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Perplexity│    │Claude API   │    │ ACCIO Work  │
│   Sonar     │    │(AI Analysis)│    │ (Sourcing)  │
│ (Research)  │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## Revenue Model

Each marketplace earns on the **managed spread**:

```
Buyer Quote = Market Rate + 15-25% Margin
Supplier Cost = Lower cost via ACCIO
Platform Revenue = Buyer Quote - Supplier Cost
```

Secondary revenue streams:
- Compliance-as-a-service fees
- Supply chain financing (net-30/60 terms)
- Seller services (MRO supplies, document generation)

---

## Deployment

### GitHub Actions Pipeline
```
Push to main/[marketplace-slug]
    │
    ▼
Run pytest + vitest
    │
    ▼
Deploy Frontend → Netlify
    │
    ▼
Deploy Backend → Railway
    │
    ▼
Run Smoke Tests
```

### Environment Naming
```bash
# Marketplace-specific
MRODIRECT_BASEROW_TOKEN=xxx
CHEEMOS_STRIPE_KEY=xxx

# Shared services
FIRECRAWL_API_KEY=xxx
PERPLEXITY_API_KEY=xxx
```

---

## License

MIT License - See LICENSE file for details

---

## Support

For questions or support:
- Documentation: `/docs`
- Issues: GitHub Issues
- Email: dev@marketplace-os.io

---

*Built with ❤️ by the Marketplace OS Team*
*Portfolio: 20 B2B Marketplaces | Stack: React + FastAPI + Baserow + n8n*
*Data Intelligence: Firecrawl + Perplexity Sonar + Claude API + ACCIO Work*
