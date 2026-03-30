# Marketplace OS - Quick Reference Guide
## Links & Access Points for All 20 B2B Marketplaces

---

## 🚀 Quick Access Links

### Local Development URLs

| # | Marketplace | Frontend | Backend | Baserow | Framework |
|---|-------------|----------|---------|---------|-----------|
| 1 | MRODirect | http://localhost:3001 | http://localhost:8001 | http://localhost:8080 | Medusa.js |
| 2 | ChemOS | http://localhost:3002 | http://localhost:8002 | http://localhost:8080 | Saleor |
| 3 | BuildSource | http://localhost:3003 | http://localhost:8003 | http://localhost:8080 | Medusa.js |
| 4 | MedSupplyOS | http://localhost:3004 | http://localhost:8004 | http://localhost:8080 | OroCommerce |
| 5 | VoltSource | http://localhost:3005 | http://localhost:8005 | http://localhost:8080 | Saleor |
| 6 | LithiumBuy | http://localhost:3006 | http://localhost:8006 | http://localhost:8080 | Saleor+Custom |
| 7 | FoodOps | http://localhost:3007 | http://localhost:8007 | http://localhost:8080 | Medusa.js |
| 8 | PackSource | http://localhost:3008 | http://localhost:8008 | http://localhost:8080 | Medusa.js |
| 9 | AgroOps | http://localhost:3009 | http://localhost:8009 | http://localhost:8080 | Medusa.js |
| 10 | LabSource | http://localhost:3010 | http://localhost:8010 | http://localhost:8080 | Saleor |
| 11 | RigSource | http://localhost:3011 | http://localhost:8011 | http://localhost:8080 | OroCommerce |
| 12 | CareOps | http://localhost:3012 | http://localhost:8012 | http://localhost:8080 | Baserow+Softr |
| 13 | GovSource | http://localhost:3013 | http://localhost:8013 | http://localhost:8080 | OroCommerce |
| 14 | SurplusOS | http://localhost:3014 | http://localhost:8014 | http://localhost:8080 | Medusa+Custom |
| 15 | NetSource | http://localhost:3015 | http://localhost:8015 | http://localhost:8080 | Saleor |
| 16 | SecureSource | http://localhost:3016 | http://localhost:8016 | http://localhost:8080 | Baserow+Medusa |
| 17 | UniformOS | http://localhost:3017 | http://localhost:8017 | http://localhost:8080 | Medusa.js |
| 18 | WorkspaceOS | http://localhost:3018 | http://localhost:8018 | http://localhost:8080 | OroCommerce |
| 19 | IngredientOS | http://localhost:3019 | http://localhost:8019 | http://localhost:8080 | Saleor |
| 20 | BarrelHub | http://localhost:3020 | http://localhost:8020 | http://localhost:8080 | Baserow+Softr |

### Infrastructure Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Baserow | http://localhost:8080 | admin / (set in .env) |
| n8n | http://localhost:5678 | (set in .env) |
| Redis | localhost:6379 | (no auth default) |
| Meilisearch | http://localhost:7700 | (set in .env) |
| Prometheus | http://localhost:9090 | (none) |
| Grafana | http://localhost:3000 | admin / (set in .env) |

---

## 📁 File Structure Quick Reference

```
/mnt/okcomputer/output/marketplace-os/
│
├── 📄 Documentation
│   ├── README.md                    ← Start here
│   ├── SUPERPROMPT.md               ← Master build instructions
│   ├── MARKETPLACE_PROFILES.md      ← Individual profiles
│   ├── QUICK_REFERENCE.md           ← This file
│   ├── PROJECT_SUMMARY.md           ← Build summary
│   └── .env.example                 ← Environment template
│
├── 🏗️ Infrastructure
│   └── infrastructure/
│       └── docker-compose.yml       ← Full stack orchestration
│
├── 📦 Shared Packages
│   └── packages/
│       ├── shared-ui/               ← React components
│       ├── shared-types/            ← TypeScript types
│       ├── shared-api/              ← FastAPI middleware
│       └── shared-intelligence/     ← AI integrations
│
└── 🛒 Marketplaces (20 total)
    └── apps/
        ├── mrodirect/               ← #1 Industrial MRO
        ├── cheemos/                 ← #2 Specialty Chemicals
        ├── buildsource/             ← #3 Construction Materials
        ├── medsupplyos/             ← #4 Healthcare Equipment
        ├── voltsource/              ← #5 EV & Clean Energy
        ├── lithiumbuy/              ← #6 Lithium Materials
        ├── foodops/                 ← #7 Food Distribution
        ├── packsource/              ← #8 Packaging Materials
        ├── agroops/                 ← #9 Agri-Inputs
        ├── labsource/               ← #10 Laboratory Supplies
        ├── rigsource/               ← #11 Heavy Equipment
        ├── careops/                 ← #12 Home Care Staffing
        ├── govsource/               ← #13 Government Procurement
        ├── surplusos/               ← #14 Surplus Assets
        ├── netsource/               ← #15 Network Hardware
        ├── securesource/            ← #16 Security Systems
        ├── uniformos/               ← #17 B2B Uniforms
        ├── workspaceos/             ← #18 Office Furniture
        ├── ingredientos/            ← #19 Food Ingredients
        └── barrelhub/               ← #20 Bulk Spirits
```

---

## 🎯 Marketplace Quick Links by Category

### Industrial & Manufacturing

| # | Name | Domain | Key Feature | GMV Y3 |
|---|------|--------|-------------|--------|
| 1 | [MRODirect](./apps/mrodirect/) | mrodirect.io | AI substitute recommendations | $85M |
| 3 | [BuildSource](./apps/buildsource/) | buildsource.io | Project-based procurement | $68M |
| 11 | [RigSource](./apps/rigsource/) | rigsource.io | Fleet management | $26M |
| 14 | [SurplusOS](./apps/surplusos/) | surplusos.io | AI-powered asset valuation | $18M |

### Chemicals & Materials

| # | Name | Domain | Key Feature | GMV Y3 |
|---|------|--------|-------------|--------|
| 2 | [ChemOS](./apps/cheemos/) | cheemos.io | CAS lookup + compliance | $72M |
| 6 | [LithiumBuy](./apps/lithiumbuy/) | lithiumbuy.com | Live price index | $48M |
| 8 | [PackSource](./apps/packsource/) | packsource.io | Sustainability scores | $38M |
| 19 | [IngredientOS](./apps/ingredientos/) | ingredientos.io | GRAS verification | $8M |

### Healthcare & Life Sciences

| # | Name | Domain | Key Feature | GMV Y3 |
|---|------|--------|-------------|--------|
| 4 | [MedSupplyOS](./apps/medsupplyos/) | medsupplyos.io | FDA clearance verification | $61M |
| 10 | [LabSource](./apps/labsource/) | labsource.io | Lot-tracked delivery | $28M |
| 12 | [CareOps](./apps/careops/) | careops.io | Caregiver matching | $22M |

### Energy & Technology

| # | Name | Domain | Key Feature | GMV Y3 |
|---|------|--------|-------------|--------|
| 5 | [VoltSource](./apps/voltsource/) | voltsource.io | IRA compliance calculator | $54M |
| 15 | [NetSource](./apps/netsource/) | netsource.io | Authenticity verification | $16M |
| 16 | [SecureSource](./apps/securesource/) | securesource.io | Installer matching | $13M |

### Food & Agriculture

| # | Name | Domain | Key Feature | GMV Y3 |
|---|------|--------|-------------|--------|
| 7 | [FoodOps](./apps/foodops/) | foodops.io | Menu-based procurement | $44M |
| 9 | [AgroOps](./apps/agroops/) | agroops.io | Agronomic recommendations | $33M |

### Services & Specialized

| # | Name | Domain | Key Feature | GMV Y3 |
|---|------|--------|-------------|--------|
| 13 | [GovSource](./apps/govsource/) | govsource.io | FAR compliance automation | $20M |
| 17 | [UniformOS](./apps/uniformos/) | uniformos.io | Size matrix configurator | $11M |
| 18 | [WorkspaceOS](./apps/workspaceos/) | workspaceos.io | Design service integration | $9M |
| 20 | [BarrelHub](./apps/barrelhub/) | barrelhub.io | Barrel tracking | $6M |

---

## 🛠️ Build Commands Quick Reference

### Start All Infrastructure
```bash
cd /mnt/okcomputer/output/marketplace-os/infrastructure
docker-compose up -d
```

### Start Individual Marketplace

```bash
# Navigate to marketplace
cd /mnt/okcomputer/output/marketplace-os/apps/[marketplace-name]

# Start Frontend
cd frontend
npm install
npm run dev

# Start Backend (new terminal)
cd backend
pip install -r requirements.txt
uvicorn src.main:app --reload --port [PORT]
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
docker build -t [marketplace-name]-backend .
```

---

## 📊 Key Metrics Dashboard

### Portfolio Overview

```
Total Marketplaces:        20
Total GMV (Year 3):        $680M
Total Platform Revenue:    $111M
Average Take Rate:         16.3%

By Framework:
- Medusa.js:     8 marketplaces
- Saleor:        6 marketplaces
- OroCommerce:   4 marketplaces
- Baserow+Softr: 2 marketplaces

By Revenue Tier:
- Tier 1 ($85M-$48M):  6 marketplaces
- Tier 2 ($44M-$20M):  8 marketplaces
- Tier 3 ($18M-$6M):   6 marketplaces
```

### Top 5 by GMV

| Rank | Marketplace | GMV Y3 | Primary Revenue |
|------|-------------|--------|-----------------|
| 1 | MRODirect | $85M | $12M |
| 2 | ChemOS | $72M | $14M |
| 3 | BuildSource | $68M | $6.8M |
| 4 | MedSupplyOS | $61M | $10.7M |
| 5 | VoltSource | $54M | $6.5M |

---

## 🔌 API Endpoints Quick Reference

### Standard Endpoints (All Marketplaces)

```
# Authentication
POST   /auth/register
POST   /auth/login
GET    /auth/me
POST   /auth/refresh

# Products/Services
GET    /products
GET    /products/:id
GET    /products/search

# RFQ
GET    /rfq
POST   /rfq
GET    /rfq/:id
PUT    /rfq/:id/status

# Quotes
GET    /quotes
POST   /quotes
PUT    /quotes/:id/accept
PUT    /quotes/:id/reject

# Orders
GET    /orders
POST   /orders
GET    /orders/:id
PUT    /orders/:id/status

# Admin
GET    /admin/dashboard
GET    /admin/users
GET    /admin/suppliers
```

### Baserow API Pattern

```python
# Always use user_field_names=true
GET    https://baserow.io/api/database/rows/table/{table_id}/?user_field_names=true
POST   https://baserow.io/api/database/rows/table/{table_id}/?user_field_names=true
PATCH  https://baserow.io/api/database/rows/table/{table_id}/{row_id}/?user_field_names=true
```

---

## 🎨 Design System Quick Reference

### Colors
```css
--void: #080C14;
--surface: #0F1623;
--elevated: #162032;
--border: #1E2D45;
--teal: #0ABFBC;
--white: #F8FAFC;
```

### Fonts
```css
/* Display */
font-family: 'Syne', sans-serif;

/* Body */
font-family: 'DM Sans', sans-serif;

/* Numbers/Code */
font-family: 'JetBrains Mono', monospace;
```

### Status Badge Pattern
```tsx
<span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider
  bg-void border border-border text-slate">
  {status}
</span>
```

---

## 📞 Support & Resources

### Documentation
- [Main README](./README.md) - Architecture overview
- [SUPERPROMPT](./SUPERPROMPT.md) - Build instructions
- [MARKETPLACE_PROFILES](./MARKETPLACE_PROFILES.md) - Individual profiles
- [PROJECT_SUMMARY](./PROJECT_SUMMARY.md) - Build summary

### Configuration
- [.env.example](./.env.example) - Environment variables template

### Infrastructure
- [docker-compose.yml](./infrastructure/docker-compose.yml) - Full stack

---

**Portfolio: 20 B2B Marketplaces | Stack: React + FastAPI + Baserow + n8n**
**Data Intelligence: Firecrawl + Perplexity Sonar + Claude API + ACCIO Work**
**Total GMV: $680M (Year 3) | Total Revenue: $111M (Year 3)**
