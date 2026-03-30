# MARKETPLACE OS - MASTER SUPERPROMPT
## Build Instructions for 20 B2B Vertical Marketplaces

**Version:** 2.0 | **Date:** March 2026 | **Portfolio GMV:** $680M (Year 3)

---

# PART 1: UNIVERSAL BUILD INSTRUCTIONS

Use this section as your system context when building ANY marketplace in this portfolio.

## Architecture Stack (Non-Negotiable)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
│  React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query   │
│  Syne (display) | DM Sans (body) | JetBrains Mono (numbers)     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                             │
│  FastAPI (Python 3.12) + Pydantic v2 + JWT + httpx              │
│  All Baserow calls use ?user_field_names=true                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMMERCE FRAMEWORK                          │
│  Medusa.js (physical goods) | Saleor (attributes) |             │
│  OroCommerce (enterprise) | Baserow+Softr (services)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  Baserow (primary) + PostgreSQL (commerce) + Redis (cache)      │
└─────────────────────────────────────────────────────────────────┘
```

## Design System (Apply to All)

### Color Palette
```css
--void: #080C14;        /* Primary background */
--surface: #0F1623;     /* Card backgrounds */
--elevated: #162032;    /* Hover states */
--border: #1E2D45;      /* Borders */
--muted: #2A3F5F;       /* Secondary elements */
--slate: #64748B;       /* Muted text */
--text: #E2E8F0;        /* Primary text */
--white: #F8FAFC;       /* Headlines */
--teal: #0ABFBC;        /* Primary action (default) */
--teal-dim: #0A8F8D;    /* Hover state */
--teal-glow: rgba(10,191,188,0.12); /* Glow effects */
```

### Typography
- **Display:** Syne (400, 500, 600, 700)
- **Body:** DM Sans (300, 400, 500)
- **Monospace:** JetBrains Mono (400, 500)

### Design Principles
1. Dark-first UI (never light mode default)
2. No gradients, no shadows
3. Flat surfaces with precise 0.5px borders
4. Pill-shaped status badges (monospace, uppercase)
5. 8px grid system

## Baserow Integration Rules (CRITICAL)

1. **ALWAYS** include `?user_field_names=true` on every API call
2. **NEVER** store row IDs as plain text - use Link to Table fields
3. **CREATE** dedicated API token per integration
4. **WRITE** to AUDIT_LOG as last step of every automation
5. **AUDIT_LOG is append-only** - never update or delete rows

## Required Pages (Every Marketplace)

```
/                           → Landing (hero, stats, features, CTA)
/directory                  → Product/Service Directory (search, filters)
/directory/:id              → Detail Page (specs, compliance, suppliers)
/rfq                        → RFQ Wizard (multi-step form)
/dashboard                  → Buyer Dashboard (orders, quotes, account)
/admin                      → Admin Dashboard (users, suppliers, analytics)
/login                      → Login
/register                   → Registration
```

## Required API Endpoints (Every Backend)

```
POST   /auth/register           → Buyer registration
POST   /auth/login              → JWT token generation
GET    /auth/me                 → Current user profile
POST   /auth/refresh            → Refresh access token

GET    /products                → List with filters/pagination
GET    /products/:id            → Single product detail
GET    /products/search         → Full-text search

GET    /rfq                    → List buyer's RFQs
POST   /rfq                    → Create new RFQ
GET    /rfq/:id                → RFQ details
PUT    /rfq/:id/status         → Update status

GET    /quotes                 → List quotes
POST   /quotes                 → Create quote (admin)
PUT    /quotes/:id/accept      → Accept quote
PUT    /quotes/:id/reject      → Reject quote

GET    /orders                 → List orders
POST   /orders                 → Create from quote
GET    /orders/:id             → Order details
PUT    /orders/:id/status      → Update status

GET    /admin/dashboard        → Platform stats
GET    /admin/users            → User management
GET    /admin/suppliers        → Supplier management
```

## Revenue Model (All Marketplaces)

```
Buyer Quote Price = Market Rate + Platform Margin (15-25%)
Supplier Cost = Sourced via ACCIO at lower cost
Platform Revenue = Buyer Quote - Supplier Cost

Secondary Revenue:
- Compliance-as-a-service: $500-2,000/order
- Supply chain financing: 2-4% of transaction
- Seller services: $100-500/month
```

---

# PART 2: MARKETPLACE BUILD MATRIX

## Framework Selection Decision Tree

```
Is it physical goods with SKUs?
├── YES → Does it need complex variants?
│   ├── YES → Use Saleor (ChemOS, VoltSource, LabSource, NetSource, IngredientOS)
│   └── NO → Use Medusa.js (MRODirect, BuildSource, FoodOps, PackSource, AgroOps, SurplusOS, UniformOS)
│
Is it enterprise B2B with complex approvals?
├── YES → Use OroCommerce (MedSupplyOS, RigSource, GovSource, WorkspaceOS)
│
Is it a service marketplace?
└── YES → Use Baserow + Softr (CareOps, BarrelHub, SecureSource)
```

## Build Priority Sequence

```
Month 1-2:  ChemOS (#2) + MRODirect (#1)    [Highest revenue ceiling]
Month 3:    LithiumBuy (#6)                  [Existing brand asset]
Month 4:    BuildSource (#3) + VoltSource (#5) [Medusa.js shared]
Month 5-6:  MedSupplyOS (#4) + LabSource (#10) [Regulated verticals]
Month 7-12: Remaining 13 marketplaces         [Leverage shared infrastructure]
```

---

# PART 3: INDIVIDUAL MARKETPLACE PROFILES

## PRD #1 — MRODirect (Industrial MRO)

### Identity
- **Domain:** mrodirect.io
- **Tagline:** "The intelligent procurement platform for industrial maintenance"
- **Primary Color:** Steel Blue #2563EB
- **Framework:** Medusa.js

### Market Context
Industrial MRO is a $700B global market dominated by Grainger, Fastenal, and MSC Industrial. SME manufacturers pay premium prices with slow fulfillment. No AI-powered managed marketplace exists.

### Target Customers
- Plant maintenance managers
- Operations directors
- Procurement teams at mid-market manufacturers (50-500 employees)
- Industries: automotive, aerospace, food processing, general manufacturing

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $2,400 |
| Order Frequency | 3.2x per month per buyer |
| Take Rate | 14-18% |
| Year 1 GMV | $12M |
| Year 2 GMV | $38M |
| Year 3 GMV | $85M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (14-18%) | $12M (Y3) |
| **Supply Chain Financing** | Net-60 terms to suppliers (2% fee) | $2.5M (Y3) |
| **MRO Supplies Store** | Consumables subscription | $1.8M (Y3) |
| **Emergency Fulfillment** | 4-hour delivery premium (25% fee) | $950K (Y3) |
| **AI Substitute Recommendations** | SaaS feature | $600K (Y3) |

### Unique Features
1. **Machine Profile Matching** - "Find all parts for my Haas VF-2"
2. **AI Substitute Recommendations** - When parts are out of stock
3. **Emergency Fulfillment** - 4-hour line-down sourcing via ACCIO
4. **Supplier Contract Tiers** - Volume-based pricing agreements

### Baserow Tables (Beyond Standard)
- PARTS_CATALOG (500K+ rows)
- MACHINE_REGISTRY (buyer equipment list)
- SUPPLIER_CONTRACTS (tiered pricing)

### Firecrawl Targets
- Grainger product pages (competitive pricing)
- RS Group catalog
- Manufacturer parts databases
- NIST component databases

### Sonar Queries
- "MRO supply chain disruptions Q2 2026"
- "bearing lead times automotive sector"
- "fastener pricing trends North America"

---

## PRD #2 — ChemOS (Specialty Chemicals)

### Identity
- **Domain:** cheemos.io
- **Tagline:** "The intelligence layer for specialty chemicals procurement"
- **Primary Color:** Teal #0ABFBC
- **Framework:** Saleor

### Market Context
$940B global TAM. Less than 15% digitized. Compliance layer (REACH, TSCA, EPA) creates defensible moat no generalist platform can replicate.

### Target Customers
- Procurement managers
- R&D chemists
- QA/compliance officers
- Plant engineers
- Sustainability managers

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $18,500 |
| Order Frequency | Monthly recurring |
| Take Rate | 18-22% |
| Year 1 GMV | $10M |
| Year 2 GMV | $32M |
| Year 3 GMV | $72M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (18-22%) | $14M (Y3) |
| **Compliance-as-a-Service** | SDS/COA generation ($500/order) | $3.6M (Y3) |
| **Supply Chain Financing** | Net-30/60 terms (3% fee) | $2.2M (Y3) |
| **Price Index Subscription** | Market intelligence ($2,500/mo) | $1.2M (Y3) |
| **AI Compliance Reports** | Automated regulatory analysis | $800K (Y3) |

### Unique Features
1. **CAS Number Lookup Tool** - 12,400+ pages for programmatic SEO
2. **AI-Generated Compliance Reports** - REACH/TSCA/EPA status
3. **Live Price Index** - Historical pricing with trends
4. **ACCIO Autonomous Sourcing** - Natural language chemical sourcing

### Baserow Tables (Beyond Standard)
- COMPLIANCE_REGISTRY (per CAS number)
- MARKET_INTELLIGENCE (weekly Sonar reports)
- REGULATORY_ALERTS (EPA/REACH change tracking)

### Firecrawl Targets
- ECHA chemical database
- EPA TSCA inventory
- chemicaldirectory.com
- ICIS pricing pages
- Competitor catalogs (Knowde, BluePallet)

### Sonar Queries
- "specialty chemical price trends [category] 2026"
- "REACH regulation updates Q1 2026"
- "acetone supply tightness North America"

---

## PRD #3 — BuildSource (Construction Materials)

### Identity
- **Domain:** buildsource.io
- **Tagline:** "Project-based procurement for construction professionals"
- **Primary Color:** Concrete Gray #4B5563, Accent Orange #F97316
- **Framework:** Medusa.js

### Market Context
$1.5T global construction materials market. Procurement is hyperlocal, opaque, and phone-driven. No dominant digital marketplace exists in North America.

### Target Customers
- General contractors
- Project managers
- Procurement directors at mid-size construction firms ($10M-$500M revenue)

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $34,000 |
| Order Frequency | 2-4x per project phase |
| Take Rate | 8-12% |
| Year 1 GMV | $9M |
| Year 2 GMV | $28M |
| Year 3 GMV | $68M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (8-12%) | $6.8M (Y3) |
| **Project Finance** | Invoice factoring (4% fee) | $2.7M (Y3) |
| **Logistics Coordination** | Delivery management ($500/order) | $1.4M (Y3) |
| **LEED Certification Tracking** | Sustainability documentation | $900K (Y3) |
| **Bulk Testing Certification** | Material testing service | $600K (Y3) |

### Unique Features
1. **Project-Based Procurement** - All materials for a job tracked together
2. **Regional Supplier Optimization** - Minimize haul distance
3. **LEED Material Tracking Dashboard** - MR credits monitoring
4. **Emergency Delivery Sourcing** - ACCIO for critical deadlines

### Baserow Tables (Beyond Standard)
- PROJECTS (construction projects)
- REGIONAL_AVAILABILITY (inventory by zip code)
- SPEC_SHEETS (ASTM/ACI documents)

### Firecrawl Targets
- RS Means pricing database
- ENR cost indices
- Regional supplier websites
- Material Bank for interior products
- LEED certification databases

### Sonar Queries
- "ready-mix concrete prices [metro area]"
- "steel rebar supply Q2 2026"
- "lumber price forecast 2026"

---

## PRD #4 — MedSupplyOS (Healthcare Equipment & MRO)

### Identity
- **Domain:** medsupplyos.io
- **Tagline:** "FDA-compliant procurement for healthcare systems"
- **Primary Color:** Clinical Blue #0EA5E9, Accent White
- **Framework:** OroCommerce

### Market Context
Fastest-growing B2B vertical at 22.35% CAGR. Healthcare MRO is a $400B market gated by regulatory complexity. 40% of hospital purchases happen outside GPO contracts.

### Target Customers
- Materials managers
- Supply chain directors
- Biomedical engineers at hospitals, surgical centers, diagnostic labs

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $8,200 |
| Order Frequency | 2.1x per month per account |
| Take Rate | 15-20% |
| Year 1 GMV | $8M |
| Year 2 GMV | $25M |
| Year 3 GMV | $61M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (15-20%) | $10.7M (Y3) |
| **FDA Compliance Documentation** | 510(k) verification ($750/order) | $2.4M (Y3) |
| **GPO Bypass Analytics** | Price benchmarking ($500/mo) | $1.8M (Y3) |
| **Equipment Maintenance Contracts** | Service management | $1.2M (Y3) |
| **Emergency Sourcing** | Critical care equipment (20% fee) | $900K (Y3) |

### Unique Features
1. **UDI-Compliant Order Tracking** - GS1-128 and DataMatrix support
2. **FDA Clearance Verification** - Real-time 510(k) lookup
3. **GPO Price Benchmarking** - Show savings vs GPO rates
4. **Corporate Account Hierarchies** - Health system → hospital → department

### Baserow Tables (Beyond Standard)
- FACILITIES (hospital/clinic registry)
- REGULATORY_CLEARANCES (FDA 510(k), PMA, CE)
- GPO_CONTRACTS (pricing tiers)
- BIOMEDICAL_EQUIPMENT (installed equipment)

### Firecrawl Targets
- FDA device database (510k clearances)
- Hospital GPO member directories
- ECRI Institute product evaluations
- Premier/Vizient contract pages

### Sonar Queries
- "healthcare supply chain shortages 2026"
- "surgical instrument pricing trends"
- "FDA device clearance backlog status"

---

## PRD #5 — VoltSource (EV & Clean Energy Components)

### Identity
- **Domain:** voltsource.io
- **Tagline:** "IRA-compliant sourcing for the energy transition"
- **Primary Color:** Electric Yellow #EAB308
- **Framework:** Saleor

### Market Context
$150B market growing at 25%+ CAGR. CHIPS Act and IRA created $630B in domestic manufacturing investment requiring specialty components.

### Target Customers
- Procurement engineers
- Supply chain managers
- Project developers at EV manufacturers, solar installers, battery pack assemblers

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $42,000 |
| Order Frequency | Monthly (project-driven) |
| Take Rate | 10-14% |
| Year 1 GMV | $7M |
| Year 2 GMV | $22M |
| Year 3 GMV | $54M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (10-14%) | $6.5M (Y3) |
| **IRA Compliance Documentation** | Tax credit qualification ($1,000/order) | $2.2M (Y3) |
| **Supply Chain Risk Monitoring** | Geopolitical alerts ($2,500/mo) | $1.5M (Y3) |
| **Carbon Footprint Tracking** | Per-order emissions | $800K (Y3) |
| **Battery Chemistry Matching** | AI-powered spec matching | $600K (Y3) |

### Unique Features
1. **IRA Domestic Content Calculator** - Automatic per order
2. **SVHC/RoHS Compliance Verification** - Certification tracking
3. **Supply Chain Risk Score** - Per supplier risk assessment
4. **Battery Chemistry Specification Matching** - NMC/LFP/NCA matching

### Baserow Tables (Beyond Standard)
- IRA_COMPLIANCE_TRACKER (domestic content %)
- SUPPLY_CHAIN_RISK (geopolitical flags)
- CERTIFICATION_REGISTRY (UL, IEC, DoE)

### Firecrawl Targets
- DoE EERE databases
- UL product certification search
- BloombergNEF pricing
- Solar/storage trade publication indices

### Sonar Queries
- "lithium battery cell prices Q2 2026"
- "IRA domestic content requirements latest"
- "solar panel supply chain China tariffs"

---

## PRD #6 — LithiumBuy (Lithium Materials)

### Identity
- **Domain:** lithiumbuy.com
- **Tagline:** "The Bloomberg of lithium — spot prices, contracts, and sourcing"
- **Primary Color:** Lithium Blue #3B82F6
- **Framework:** Saleor + Custom FastAPI Pricing Engine

### Market Context
Dedicated B2B lithium materials marketplace. Zero digital standard for lithium carbonate, hydroxide, and spodumene spot market.

### Target Customers
- Battery manufacturers
- Cathode material producers
- Energy storage developers
- EV OEM procurement teams

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $285,000 (metric ton pricing) |
| Order Frequency | Quarterly contract + monthly spot |
| Take Rate | 3-6% on spot |
| Year 1 GMV | $15M |
| Year 2 GMV | $32M |
| Year 3 GMV | $48M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Spot trading spread (3-6%) | $2.4M (Y3) |
| **Price Index Subscription** | Full market data ($2,500/mo) | $1.8M (Y3) |
| **Supply Chain Risk Reports** | Sonar-powered analysis ($1,000/mo) | $1.2M (Y3) |
| **Contract Management** | Long-term offtake facilitation | $900K (Y3) |
| **Hedging Advisory** | Introductions to commodity desks | $600K (Y3) |

### Unique Features
1. **Live Price Index** - Real-time lithium spot prices
2. **Supply Tightness Alerts** - Market condition notifications
3. **IRA-Compliant Source Certification** - Domestic content tracking
4. **Contract Term Management** - Quarterly + spot workflows

### Baserow Tables (Beyond Standard)
- SPOT_PRICE_HISTORY (daily prices)
- MINE_REGISTRY (producing mines)
- CONTRACT_TERMS (long-term offtake)
- GEOPOLITICAL_RISK (country scores)

### Firecrawl Targets
- Fastmarkets lithium price pages
- Benchmark Mineral Intelligence
- S&P Global Commodity Insights
- Mining company investor relations

### Sonar Queries
- "lithium carbonate spot price today"
- "China lithium export policy 2026"
- "Australian spodumene mine output Q1 2026"

---

## PRD #7 — FoodOps (Commercial Food Distribution)

### Identity
- **Domain:** foodops.io
- **Tagline:** "Menu-based procurement for restaurants and institutions"
- **Primary Color:** Warm Olive #65A30D
- **Framework:** Medusa.js + Custom Cold Chain Module

### Market Context
$400B commercial food distribution market dominated by Sysco and US Foods. SME restaurants pay retail-adjacent prices with 2-day lead times.

### Target Customers
- Executive chefs
- Food & beverage directors
- Purchasing managers at restaurants, hotels, healthcare foodservice, universities

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $3,800 |
| Order Frequency | 2.3x per week (perishables) + 1x monthly (dry goods) |
| Take Rate | 6-10% |
| Year 1 GMV | $6M |
| Year 2 GMV | $19M |
| Year 3 GMV | $44M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (6-10%) | $3.5M (Y3) |
| **Demand Forecasting-as-a-Service** | AI weekly usage prediction ($500/mo) | $1.8M (Y3) |
| **FSMA Compliance Documentation** | Lot traceability ($300/order) | $1.3M (Y3) |
| **Cold Chain Monitoring** | Temperature tracking ($200/order) | $900K (Y3) |
| **Menu Engineering Tools** | Profitability analysis | $600K (Y3) |

### Unique Features
1. **Menu-Based Procurement** - Generate orders from weekly menu
2. **AI Demand Forecasting** - Predict usage from historical data
3. **FSMA Lot Traceability Dashboard** - One-up-one-back compliance
4. **Cold Chain Temperature Monitoring** - Real-time tracking

### Baserow Tables (Beyond Standard)
- MENU_ENGINEERING (menu items → ingredients)
- LOT_TRACKING (FSMA lot + expiry)
- ALLERGEN_REGISTRY (allergen matrix)
- TEMPERATURE_LOGS (cold chain compliance)

### Firecrawl Targets
- USDA market news price reports
- Regional food distributor websites
- FDA FSMA inspection databases
- Specialty food trade publication pricing

### Sonar Queries
- "commodity food prices 2026 avocado tomato"
- "FSMA traceability rule enforcement timeline"
- "restaurant supply chain disruptions"

---

## PRD #8 — PackSource (Packaging Materials)

### Identity
- **Domain:** packsource.io
- **Tagline:** "Sustainable packaging procurement with sample fulfillment"
- **Primary Color:** Forest Green #15803D
- **Framework:** Medusa.js

### Market Context
$200B global packaging market with sustainability transformation. 61% of new specifications require sustainable/recyclable materials.

### Target Customers
- Packaging engineers
- Product managers
- Procurement leads at consumer goods brands, e-commerce companies, food manufacturers

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $12,400 |
| Order Frequency | Quarterly (launches) + monthly (replenishment) |
| Take Rate | 10-14% |
| Year 1 GMV | $5M |
| Year 2 GMV | $16M |
| Year 3 GMV | $38M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (10-14%) | $4.6M (Y3) |
| **Sustainability Certification** | Third-party verification ($750/order) | $1.4M (Y3) |
| **Custom Printing Management** | Artwork coordination ($500/order) | $1.1M (Y3) |
| **Sample Fulfillment** | Material Bank-style samples | $900K (Y3) |
| **EPR Compliance Tracking** | State-by-state monitoring ($300/mo) | $600K (Y3) |

### Unique Features
1. **Sustainability Score on Every SKU** - LCA data, PCR content
2. **Sample-Before-You-Commit Workflow** - Free sample fulfillment
3. **Custom Packaging Brief-to-Quote** - 48 hours via ACCIO
4. **EPR Compliance Tracking** - Extended Producer Responsibility by state

### Baserow Tables (Beyond Standard)
- DESIGN_FILES (3D die-cut, flat art)
- SUSTAINABILITY_SCORES (LCA data, PCR %)
- SAMPLE_REQUESTS (tracking)
- PRINT_SPECS (color, substrate, dieline)

### Firecrawl Targets
- FINAT label industry pricing
- Packaging Digest market reports
- EcoVadis certification database
- How2Recycle database
- Competitor marketplaces (uline.com)

### Sonar Queries
- "sustainable packaging material costs 2026"
- "corrugated board prices North America"
- "extended producer responsibility regulations"

---

## PRD #9 — AgroOps (Agri-Inputs & Farm Supplies)

### Identity
- **Domain:** agroops.io
- **Tagline:** "Agronomic intelligence for modern farming operations"
- **Primary Color:** Field Gold #D97706
- **Framework:** Medusa.js

### Market Context
$250B global agri-inputs market (seed, fertilizer, crop protection). Highly fragmented regionally. Zero price transparency through local co-ops.

### Target Customers
- Large farms (500+ acres)
- Agribusiness procurement managers
- Farm management companies
- Ag co-op purchasing directors

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $22,000 |
| Order Frequency | Seasonal (2-3 purchases per growing season) |
| Take Rate | 8-12% |
| Year 1 GMV | $4M |
| Year 2 GMV | $14M |
| Year 3 GMV | $33M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (8-12%) | $3.6M (Y3) |
| **Crop Input Financing** | Ag credit net-90 terms (4% fee) | $1.3M (Y3) |
| **Agronomy Consultation** | Expert recommendations ($200/hr) | $900K (Y3) |
| **Weather-Adjusted Forecasting** | Input timing optimization ($500/season) | $700K (Y3) |
| **State Registration Compliance** | Pesticide verification ($150/order) | $500K (Y3) |

### Unique Features
1. **Agronomic Recommendation Engine** - Crop + soil + weather → inputs
2. **State Registration Compliance Verification** - EPA + state tracking
3. **Ag Credit Terms** - Net-90 for seasonal cash flow
4. **Weather-Adjusted Demand Forecasting** - Optimal application timing

### Baserow Tables (Beyond Standard)
- CROP_REGISTRY (planted acres, crop types, soil)
- EPA_REGISTRATIONS (state-by-state status)
- WEATHER_INTEGRATION (NOAA data)
- SEASONAL_FORECASTS (price forecasts)

### Firecrawl Targets
- USDA NASS agricultural prices
- EPA pesticide registration database
- State department of agriculture portals
- CropLife America data

### Sonar Queries
- "fertilizer prices North America planting season 2026"
- "crop protection chemical supply tightness"
- "USDA commodity price forecasts corn soy"

---

## PRD #10 — LabSource (Laboratory & Life Sciences)

### Identity
- **Domain:** labsource.io
- **Tagline:** "Lot-tracked procurement for regulated research"
- **Primary Color:** Science Teal #0891B2
- **Framework:** Saleor

### Market Context
$60B laboratory supplies market. Post-pandemic supply chain resilience is C-suite priority. GMP compliance and traceability add defensible complexity.

### Target Customers
- Lab managers
- Research directors
- Purchasing coordinators at pharma R&D, biotech companies, CROs, universities

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $4,600 |
| Order Frequency | 2.8x per month |
| Take Rate | 14-18% |
| Year 1 GMV | $3.5M |
| Year 2 GMV | $11M |
| Year 3 GMV | $28M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (14-18%) | $4.2M (Y3) |
| **Cold Chain Tracking Service** | Temperature monitoring ($400/order) | $1.2M (Y3) |
| **CLIA Compliance Documentation** - Waiver verification ($300/order) | $900K (Y3) |
| **Grant Procurement Support** - Federal compliance ($500/order) | $700K (Y3) |
| **Lot-Tracked Delivery Premium** - CoA before shipping ($200/order) | $600K (Y3) |

### Unique Features
1. **Lot-Tracked Delivery** - CoA before every shipment
2. **Cold Chain Temperature Monitoring** - Real-time excursion alerts
3. **Grant Procurement Compliance Records** - NSF/NIH documentation
4. **Substitute Recommendations** - AI-powered alternatives for backorders

### Baserow Tables (Beyond Standard)
- LOT_REGISTRY (CoA per lot)
- COLD_CHAIN_COMPLIANCE (temp logs)
- GRANT_PROCUREMENT (NSF/NIH links)
- CLIA_REGISTRY (waived products)

### Firecrawl Targets
- Fisher Scientific catalog pricing
- Sigma-Aldrich pricing
- CLIA waiver databases
- NIH reagent program databases
- Lab safety databases (MSDS/SDS)

### Sonar Queries
- "laboratory reagent supply shortages 2026"
- "biosafety cabinet availability lead times"
- "PCR reagent pricing trends"

---

## PRD #11 — RigSource (Freight & Heavy Equipment)

### Identity
- **Domain:** rigsource.io
- **Tagline:** "Fleet procurement for logistics professionals"
- **Primary Color:** Heavy Equipment Yellow #F59E0B
- **Framework:** OroCommerce

### Market Context
$90B freight trailer and heavy equipment rental/purchase market. Resale and rental market is fragmented with no managed marketplace for fleet procurement.

### Target Customers
- Fleet managers
- Logistics companies
- Equipment rental firms
- Owner-operators

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $68,000 (purchase) / $4,200/month (rental) |
| Order Frequency | Annual fleet refresh + monthly rentals |
| Take Rate | 8-10% purchase / 12% rental |
| Year 1 GMV | $3M |
| Year 2 GMV | $10M |
| Year 3 GMV | $26M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary (Purchase)** | Managed spread (8-10%) | $1.8M (Y3) |
| **Primary (Rental)** | Monthly fee (12%) | $1.5M (Y3) |
| **Fleet Management SaaS** - Tracking & maintenance ($500/mo) | $900K (Y3) |
| **DOT Compliance Verification** - Inspection status ($200/unit) | $700K (Y3) |
| **Title/Lien Verification** - Document checking ($150/unit) | $500K (Y3) |
| **Equipment Financing** - Loan facilitation (2% fee) | $400K (Y3) |

### Unique Features
1. **Fleet Purchase Order Management** - Multi-unit workflows
2. **Equipment Condition Grading** - Standardized assessments
3. **DOT Inspection Status Tracking** - FMCSA integration
4. **Title/Lien Verification** - Document validation

### Baserow Tables (Beyond Standard)
- FLEET_REGISTRY (fleet profiles)
- FLEET_UNITS (individual vehicles)
- EQUIPMENT_INSPECTIONS (DOT records)
- TITLE_REGISTRY (lien checks)

### Firecrawl Targets
- Commercial Truck Trader listings
- TruckPaper pricing data
- FMCSA SAFER database
- EquipmentWatch valuation data
- Ritchie Bros auction results

### Sonar Queries
- "commercial truck prices 2026"
- "trailer manufacturing lead times"
- "FMCSA compliance requirements updates"

---

## PRD #12 — CareOps (Home Care & Staffing)

### Identity
- **Domain:** careops.io
- **Tagline:** "Verified caregiver matching for families and payers"
- **Primary Color:** Warm Amber #F59E0B
- **Framework:** Baserow + Softr (MVP)

### Market Context
$125B home care market, primarily offline. Worker-owned care cooperatives represent underserved supply side.

### Target Customers
- Hospital discharge planners
- Managed care organizations
- Private pay families
- Corporate HR benefits managers

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $3,200/month (ongoing care contract) |
| Order Frequency | Subscription-style recurring |
| Take Rate | 10-12% on care hours billed |
| Year 1 GMV | $2.5M |
| Year 2 GMV | $8M |
| Year 3 GMV | $22M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Care hours commission (10-12%) | $2.4M (Y3) |
| **Worker Training Certification** - Course marketplace | $800K (Y3) |
| **Care Coordination SaaS** - Agency tools ($300/mo) | $700K (Y3) |
| **Background Check Fees** - Checkr/Sterling integration ($50/check) | $500K (Y3) |
| **Insurance Authorization Management** - Prior auth support | $400K (Y3) |

### Unique Features
1. **Caregiver Profile Search** - By certifications, languages, specializations
2. **Care Plan Builder** - Hours/week, specific needs, medical considerations
3. **Scheduling System** - Calendar integration, shift management
4. **Background Check Integration** - Checkr or Sterling API

### Baserow Tables (Beyond Standard)
- CAREGIVER_PROFILES (supply side)
- CARE_PLANS (buyer requirements)
- BACKGROUND_CHECKS (integration)
- PAYER_AUTHORIZATIONS (insurance)
- SCHEDULES (assignments)

### Firecrawl Targets
- State caregiver registries
- Training certification databases
- Medicaid waiver program directories
- Home care agency listings

### Sonar Queries
- "home care worker wages 2026"
- "Medicaid home care policy updates"
- "caregiver shortage trends"

---

## PRD #13 — GovSource (Government Procurement)

### Identity
- **Domain:** govsource.io
- **Tagline:** "FAR-compliant vendor matching for government buyers"
- **Primary Color:** Federal Blue #1D4ED8
- **Framework:** OroCommerce

### Market Context
$120B government procurement market. SAM.gov and state portals are compliance-gated but slow. Pre-qualified vendor marketplace captures pent-up demand.

### Target Customers
- Government procurement officers
- Small business contracting officers
- Agency program managers (federal, state, municipal)
- Set-aside eligible vendors (8(a), HUBZone, SDVOSB, WOSB)

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $85,000 |
| Order Frequency | Quarterly RFP cycles |
| Take Rate | 3-6% (lower rate, compliance premium) |
| Year 1 GMV | $2M |
| Year 2 GMV | $7M |
| Year 3 GMV | $20M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Transaction fee (3-6%) | $1M (Y3) |
| **SAM.gov Compliance Automation** - Registration verification ($500/vendor) | $600K (Y3) |
| **Set-Aside Program Management** - Certification tracking ($300/mo) | $500K (Y3) |
| **FAR/DFARS Documentation** - Clause automation ($750/RFP) | $400K (Y3) |
| **Security Clearance Verification** - Background checks ($200/person) | $300K (Y3) |
| **Performance Bond Facilitation** - Surety introductions (1% fee) | $200K (Y3) |

### Unique Features
1. **Vendor Pre-Qualification** - Automated SAM.gov verification
2. **FAR/DFARS Compliance Automation** - Documentation generation
3. **RFP-to-Supplier Matching** - Capability-based matching
4. **Set-Aside Eligibility Tracking** - 8(a), HUBZone, SDVOSB, WOSB

### Baserow Tables (Beyond Standard)
- VENDOR_QUALIFICATIONS (certifications)
- RFP_REGISTRY (opportunities)
- FAR_COMPLIANCE (clause tracking)
- SET_ASIDE_TRACKING (eligibility)

### Firecrawl Targets
- SAM.gov entity registrations
- GSA Schedule contract pages
- Agency procurement forecast pages
- SBA certification databases

### Sonar Queries
- "government procurement policy updates 2026"
- "federal contracting spending trends"
- "small business set-aside changes"

---

## PRD #14 — SurplusOS (Surplus & Salvage Assets)

### Identity
- **Domain:** surplusos.io
- **Tagline:** "AI-powered asset liquidation with guaranteed fulfillment"
- **Primary Color:** Industrial Orange #EA580C
- **Framework:** Medusa.js + Custom Auction Engine

### Market Context
$30B surplus and salvage assets market. Copart and Liquidity Services dominate but lack AI valuation and managed fulfillment.

### Target Customers
- Corporate asset managers
- Plant closures teams
- Insurance adjusters
- Manufacturing companies liquidating idle equipment

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $12,400 |
| Order Frequency | Quarterly liquidation events |
| Take Rate | 18-22% (highest in portfolio) |
| Year 1 GMV | $1.5M |
| Year 2 GMV | $6M |
| Year 3 GMV | $18M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Transaction fee (18-22%) | $3.6M (Y3) |
| **AI Valuation Service** - Photo-based assessment ($200/asset) | $900K (Y3) |
| **Title Transfer Management** - Document handling ($300/transfer) | $600K (Y3) |
| **Logistics Coordination** - Shipping management ($500/order) | $500K (Y3) |
| **Auction Premium** - Reserve not met bidding (5% fee) | $400K (Y3) |
| **Asset Storage** - Warehousing during sale ($100/month) | $300K (Y3) |

### Unique Features
1. **AI-Powered Asset Valuation** - From uploaded photos
2. **Condition Grading** - Objective assessment
3. **Live Auction Engine** - Real-time bidding
4. **Title Transfer Management** - Document workflow

### Baserow Tables (Beyond Standard)
- ASSET_VALUATIONS (AI assessments)
- AUCTIONS (live bidding)
- BIDS (bid history)
- TITLE_TRANSFERS (document workflow)
- LOGISTICS (shipping coordination)

### Firecrawl Targets
- Copart auction results
- Liquidity Services listings
- EquipmentWatch valuation data
- Industry auction aggregators

### Sonar Queries
- "industrial equipment resale values 2026"
- "plant closure asset liquidation trends"
- "used machinery market conditions"

---

## PRD #15 — NetSource (Telecom & Network Hardware)

### Identity
- **Domain:** netsource.io
- **Tagline:** "Authentic network hardware with warranty passthrough"
- **Primary Color:** Network Purple #7C3AED
- **Framework:** Saleor

### Market Context
$95B telecom infrastructure market. Reseller market for Cisco, Juniper, Nokia is opaque, gray-market-prone, and fragmented.

### Target Customers
- Network engineers
- IT procurement managers
- MSPs sourcing switching, routing, optical transport, wireless access

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $28,000 |
| Order Frequency | Quarterly refresh cycles |
| Take Rate | 10-14% |
| Year 1 GMV | $1.2M |
| Year 2 GMV | $5M |
| Year 3 GMV | $16M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (10-14%) | $1.9M (Y3) |
| **Authenticity Verification** - Serial number lookup ($200/unit) | $600K (Y3) |
| **Warranty Passthrough** - Extended support ($500/unit) | $500K (Y3) |
| **NDAA Compliance Checking** - Section 889 verification ($300/order) | $400K (Y3) |
| **End-of-Life Alerts** - Lifecycle monitoring ($200/mo) | $300K (Y3) |
| **TAC Support Status** - SmartNet verification ($150/unit) | $200K (Y3) |

### Unique Features
1. **Hardware Authenticity Verification** - Serial number validation
2. **Warranty Passthrough Tracking** - Full support transfer
3. **NDAA Compliance Checking** - Section 889 banned manufacturers
4. **End-of-Life Status Alerts** - EOS/EOL notifications

### Baserow Tables (Beyond Standard)
- AUTHENTICITY_RECORDS (verification history)
- WARRANTY_REGISTRY (support transfers)
- NDAA_COMPLIANCE (banned manufacturer list)
- EOL_TRACKING (lifecycle status)

### Firecrawl Targets
- Cisco product documentation
- Juniper support portals
- Nokia hardware databases
- GSA Advantage pricing
- NDAA Section 889 banned list

### Sonar Queries
- "network equipment supply chain 2026"
- "Cisco switch pricing trends"
- "telecom infrastructure spending forecast"

---

## PRD #16 — SecureSource (Security & Surveillance)

### Identity
- **Domain:** securesource.io
- **Tagline:** "Security equipment + certified installer matching"
- **Primary Color:** Security Black #111827
- **Framework:** Baserow + Medusa.js Hybrid

### Market Context
$50B security systems market. Hardware procurement and installation network both fragmented. No marketplace handles both.

### Target Customers
- Corporate security managers
- Facilities directors
- Property managers at commercial real estate, retail chains, logistics

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $22,000 (equipment + installation) |
| Order Frequency | Annual security upgrades |
| Take Rate | 12% |
| Year 1 GMV | $1M |
| Year 2 GMV | $4M |
| Year 3 GMV | $13M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Equipment + installation (12%) | $1.4M (Y3) |
| **Installer Matching Fee** - Certified installer connection ($500/project) | $400K (Y3) |
| **Monitoring Service Integration** - Alarm connection ($300/setup) | $300K (Y3) |
| **Maintenance Contracts** - Annual service agreements | $250K (Y3) |
| **Site Assessment** - Security audit ($1,000/visit) | $200K (Y3) |
| **Permit Handling** - Municipal approval ($200/permit) | $150K (Y3) |

### Unique Features
1. **Security Equipment Catalog** - Cameras, access control, alarms
2. **Certified Installer Matching** - By location and specialization
3. **Equipment + Installation Bundling** - Single procurement workflow
4. **Installer Certification Verification** - License validation

### Baserow Tables (Beyond Standard)
- INSTALLER_PROFILES (certified installers)
- INSTALLATION_PROJECTS (job tracking)
- CERTIFICATIONS (license verification)
- SERVICE_AREAS (geographic coverage)

### Firecrawl Targets
- Manufacturer installer directories
- State licensing databases
- Security industry certification bodies
- Municipal permit databases

### Sonar Queries
- "security system installation costs 2026"
- "video surveillance market trends"
- "access control technology updates"

---

## PRD #17 — UniformOS (B2B Apparel & Uniforms)

### Identity
- **Domain:** uniformos.io
- **Tagline:** "Corporate uniform programs with custom embellishment"
- **Primary Color:** Corporate Navy #1E3A5F
- **Framework:** Medusa.js with Custom Size Matrix

### Market Context
$45B B2B uniform and workwear market. Healthcare, hospitality, corporate uniforms procured through distributors with no price transparency.

### Target Customers
- HR managers
- Operations directors
- Uniform coordinators at healthcare systems, hotel chains, restaurant groups

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $8,400 (initial kit) + $2,200/year recurring |
| Order Frequency | Annual program setup + quarterly replenishment |
| Take Rate | 12-15% |
| Year 1 GMV | $800K |
| Year 2 GMV | $3M |
| Year 3 GMV | $11M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (12-15%) | $1.3M (Y3) |
| **Embellishment Services** - Logo/embroidery ($15/unit) | $400K (Y3) |
| **Size Matrix Management** - Complex sizing tools | $200K (Y3) |
| **Program Administration** - Annual management ($500/mo) | $180K (Y3) |
| **Rush Order Processing** - Expedited fulfillment (20% fee) | $150K (Y3) |
| **Employee Allowance System** - Individual credits (3% fee) | $120K (Y3) |

### Unique Features
1. **Size Matrix Configurator** - XS-4XL + tall/short variants
2. **Embellishment Options** - Embroidery, screen print, heat transfer
3. **Pantone Color Matching** - Brand consistency
4. **Minimum Order Tracking** - Per style requirements

### Baserow Tables (Beyond Standard)
- SIZE_MATRICES (complex sizing)
- EMBELLISHMENT_OPTIONS (decoration types)
- PANTONE_MATCHES (color library)
- DECORATION_SPECS (artwork requirements)

### Firecrawl Targets
- Apparel manufacturer catalogs
- Embroidery digitization services
- Pantone color libraries
- Uniform program case studies

### Sonar Queries
- "corporate uniform program costs 2026"
- "workwear fabric technology trends"
- "hospitality uniform design trends"

---

## PRD #18 — WorkspaceOS (Office Fit-Out & Furniture)

### Identity
- **Domain:** workspaceos.io
- **Tagline:** "Project-based procurement for office transformations"
- **Primary Color:** Warm Sand #D6B896
- **Framework:** OroCommerce

### Market Context
$35B contract furniture market. SME office fit-out market ($50K-$500K projects) served by local dealers with 30-40% margins and 6-month lead times.

### Target Customers
- Office managers
- HR directors
- Facilities managers at growth-stage tech companies, co-working operators

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $68,000 (full floor fit-out) |
| Order Frequency | Bi-annual office moves |
| Take Rate | 10-14% |
| Year 1 GMV | $600K |
| Year 2 GMV | $2.5M |
| Year 3 GMV | $9M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (10-14%) | $1M (Y3) |
| **Design Service Integration** - Professional design ($5,000/project) | $300K (Y3) |
| **Project Management** - Coordination fee (5% of project) | $200K (Y3) |
| **Installation Coordination** - White glove delivery ($2,000/project) | $180K (Y3) |
| **Lease Return Management** - Furniture removal ($1,500/project) | $120K (Y3) |
| **Warranty Administration** - Claims handling ($100/unit) | $100K (Y3) |

### Unique Features
1. **Project-Based Procurement** - Full floor fit-out workflow
2. **Complex Approval Routing** - Multi-stakeholder sign-off
3. **Design Service Integration** - Professional designer matching
4. **Floor Plan Management** - Upload and visualization

### Baserow Tables (Beyond Standard)
- PROJECTS (fit-out jobs)
- FLOOR_PLANS (uploaded layouts)
- DESIGN_SERVICES (designer network)
- INSTALLATION_SCHEDULES (delivery coordination)

### Firecrawl Targets
- Steelcase dealer pricing
- Herman Miller contract terms
- Knoll product specifications
- LEED commercial interior standards

### Sonar Queries
- "office furniture pricing trends 2026"
- "workplace design trends post-pandemic"
- "commercial real estate fit-out costs"

---

## PRD #19 — IngredientOS (Specialty Food & Beverage Ingredients)

### Identity
- **Domain:** ingredientos.io
- **Tagline:** "Clean label ingredient sourcing for food innovators"
- **Primary Color:** Saffron #F59E0B
- **Framework:** Saleor

### Market Context
$50B specialty food ingredients market. Craft food brands source through fragmented distributors with no market pricing data.

### Target Customers
- R&D food scientists
- Procurement managers
- Founders at specialty food brands, nutraceutical companies

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $6,200 |
| Order Frequency | Monthly product development cycles |
| Take Rate | 12-16% |
| Year 1 GMV | $500K |
| Year 2 GMV | $2M |
| Year 3 GMV | $8M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Managed spread (12-16%) | $1.1M (Y3) |
| **GRAS Status Verification** - FDA confirmation ($500/ingredient) | $300K (Y3) |
| **Certification Management** - Organic/Non-GMO tracking ($200/order) | $200K (Y3) |
| **Allergen Documentation** - Compliance paperwork ($150/order) | $150K (Y3) |
| **Functional Claims Support** - Regulatory review ($1,000/claim) | $120K (Y3) |
| **Sample Fulfillment** - Ingredient samples ($50/sample) | $100K (Y3) |

### Unique Features
1. **GRAS Status Verification** - FDA database lookup
2. **Non-GMO/Organic Certification Tracking** - Certificate validation
3. **Allergen Declaration Management** - Compliance documentation
4. **Functional Claims Documentation** - Regulatory support

### Baserow Tables (Beyond Standard)
- REGULATORY_STATUS (GRAS tracking)
- CERTIFICATIONS (organic/non-GMO)
- ALLERGEN_PROFILES (ingredient matrices)
- FUNCTIONAL_CLAIMS (regulatory support)

### Firecrawl Targets
- FDA GRAS notice database
- USDA organic certification database
- Non-GMO Project verified list
- Flavor and Extract Manufacturers Association

### Sonar Queries
- "specialty food ingredient trends 2026"
- "clean label movement updates"
- "functional food ingredient market"

---

## PRD #20 — BarrelHub (Bulk Whiskey & Spirits)

### Identity
- **Domain:** barrelhub.io
- **Tagline:** "The marketplace for bulk aged spirits"
- **Primary Color:** Bourbon Amber #92400E
- **Framework:** Baserow + Softr (MVP)

### Market Context
$8B bulk spirits market. Opaque pricing for bulk aged whiskey, bourbon, spirits. Distilleries with aging inventory and brands needing aged liquid have no efficient matching mechanism.

### Target Customers
- Craft spirits brands (buyers)
- Distilleries with surplus inventory (sellers)
- Non-distiller producers (NDPs)
- Spirits investment funds

### Financial Projections

| Metric | Value |
|--------|-------|
| Average Order Value | $48,000 (barrel lot or bulk) |
| Order Frequency | Quarterly transactions |
| Take Rate | 8-12% |
| Year 1 GMV | $400K |
| Year 2 GMV | $1.8M |
| Year 3 GMV | $6M |

### Revenue Streams

| Stream | Description | Projected Revenue |
|--------|-------------|-------------------|
| **Primary** | Transaction fee (8-12%) | $600K (Y3) |
| **Barrel Storage Fees** - Warehousing during sale ($50/barrel/month) | $200K (Y3) |
| **TTB Compliance Documentation** - Permit verification ($500/transaction) | $150K (Y3) |
| **Sensory Evaluation Services** - Professional tasting ($1,000/lot) | $120K (Y3) |
| **Market Comparable Reports** - Pricing intelligence ($300/report) | $100K (Y3) |
| **Logistics Coordination** - TTB-bonded transport ($800/shipment) | $80K (Y3) |

### Unique Features
1. **Individual Barrel Tracking** - By barrel number, entry date
2. **TTB Permit Verification** - Automated compliance checking
3. **Sensory Evaluation Scores** - Professional tasting notes
4. **Market Comparable Transactions** - Recent pricing data

### Baserow Tables (Beyond Standard)
- BARREL_REGISTRY (individual barrels)
- TTB_COMPLIANCE (permit verification)
- SENSORY_PROFILES (tasting notes)
- MARKET_COMPS (comparable transactions)

### Firecrawl Targets
- TTB distillery permits
- Spirits industry publications (Wine Spectator, Whisky Advocate)
- Distillery auction results
- Bulk spirits broker listings

### Sonar Queries
- "bulk whiskey prices 2026"
- "bourbon barrel market trends"
- "craft spirits industry forecast"

---

# PART 4: PORTFOLIO FINANCIAL SUMMARY

## Revenue Projection Summary (Year 3)

| Tier | Marketplaces | Combined GMV | Primary Revenue | Secondary Revenue | Total Revenue |
|------|--------------|--------------|-----------------|-------------------|---------------|
| **Tier 1** | 6 | $390M | $54M | $12M | **$66M** |
| **Tier 2** | 8 | $224M | $26M | $8M | **$34M** |
| **Tier 3** | 6 | $66M | $8M | $3M | **$11M** |
| **TOTAL** | **20** | **$680M** | **$88M** | **$23M** | **$111M** |

## Revenue Mix (Portfolio Average)

```
Primary Revenue (Managed Spread):    79%  ($88M)
Supply Chain Financing:               8%  ($9M)
Compliance-as-a-Service:              5%  ($5.5M)
SaaS Subscriptions:                   4%  ($4.5M)
Premium Services:                     4%  ($4M)
```

## Key Performance Indicators (Year 3 Targets)

| Metric | Target |
|--------|--------|
| Total Active Buyers | 12,000 |
| Total Verified Suppliers | 8,500 |
| Average Order Value (Portfolio) | $18,500 |
| Gross Merchandise Value | $680M |
| Platform Revenue | $111M |
| Take Rate (Weighted Avg) | 16.3% |
| Customer Acquisition Cost | $2,400 |
| Lifetime Value | $45,000 |
| LTV:CAC Ratio | 18.75x |

---

# PART 5: BUILD INSTRUCTIONS BY FRAMEWORK

## Medusa.js Marketplaces (8 total)

### Build Command Sequence
```bash
# 1. Create Medusa project
npx create-medusa-app@latest [marketplace-name]

# 2. Configure database connection
# Edit medusa-config.js with PostgreSQL credentials

# 3. Install plugins
npm install medusa-payment-stripe medusa-fulfillment-manual

# 4. Create custom endpoints
# In src/api/ create RFQ, quote, order endpoints

# 5. Build admin UI
cd admin && npm run build

# 6. Start services
npm run start
```

### Required Customizations
- RFQ submission workflow (not native to Medusa)
- Quote management with margin tracking
- Baserow sync for supplier data
- Custom fulfillment logic per vertical

## Saleor Marketplaces (6 total)

### Build Command Sequence
```bash
# 1. Clone Saleor platform
git clone https://github.com/saleor/saleor-platform.git

# 2. Configure environment
cp .env.example .env
# Edit with database and Redis credentials

# 3. Build Docker images
docker-compose build

# 4. Run migrations
docker-compose run --rm api python3 manage.py migrate

# 5. Create superuser
docker-compose run --rm api python3 manage.py createsuperuser

# 6. Start services
docker-compose up
```

### Required Customizations
- Custom product attributes per vertical
- GraphQL queries for RFQ workflow
- Baserow integration for compliance data
- Attribute-based search filters

## OroCommerce Marketplaces (4 total)

### Build Command Sequence
```bash
# 1. Install OroCommerce
composer create-project oro/commerce-crm-application [marketplace-name]

# 2. Configure database
# Edit config/parameters.yml with PostgreSQL credentials

# 3. Install application
php bin/console oro:install --env=prod

# 4. Create admin user
php bin/console oro:user:create --env=prod

# 5. Start web server
php bin/console server:run
```

### Required Customizations
- Corporate account hierarchies
- Custom price books per GPO tier
- Quote-to-order workflow
- Clinical approval routing (healthcare)

## Baserow + Softr Marketplaces (2 total)

### Build Command Sequence
```bash
# 1. Softr is no-code, configure in UI
# Connect to Baserow API

# 2. Create Baserow tables manually
# Or use import from schema

# 3. Configure Softr blocks
# Listings, detail pages, forms

# 4. Set up automations in n8n
# For RFQ routing, notifications
```

### Required Customizations
- Custom Softr blocks for RFQ forms
- n8n workflows for matching logic
- Baserow views for different user roles

---

# PART 6: DATA INTELLIGENCE INTEGRATION

## Firecrawl Configuration (All Marketplaces)

```python
# shared-intelligence/src/firecrawl.py

FIRECRAWL_TARGETS = {
    "mrodirect": [
        "https://www.grainger.com/product/*",
        "https://www.rs-online.com/*",
        "https://www.mscdirect.com/*"
    ],
    "cheemos": [
        "https://echa.europa.eu/information-on-chemicals",
        "https://www.epa.gov/tsca-inventory",
        "https://www.chemicaldirectory.com/*"
    ],
    "buildsource": [
        "https://www.rsmeans.com/*",
        "https://enr.com/*",
        "https://www.materialbank.com/*"
    ],
    # ... etc for all 20
}
```

## Perplexity Sonar Queries (Weekly)

```python
# shared-intelligence/src/perplexity.py

SONAR_QUERIES = {
    "mrodirect": [
        "MRO supply chain disruptions Q2 2026",
        "bearing lead times automotive sector",
        "fastener pricing trends North America"
    ],
    "cheemos": [
        "specialty chemical price trends [category] 2026",
        "REACH regulation updates Q1 2026",
        "acetone supply tightness North America"
    ],
    # ... etc for all 20
}
```

## Claude API Integration

```python
# shared-intelligence/src/claude.py

CLAUDE_PROMPTS = {
    "quote_analysis": """
    Analyze this supplier quote for [marketplace]:
    - Product: {product_name}
    - Quantity: {quantity}
    - Supplier Price: ${supplier_price}
    - Market Price: ${market_price}
    
    Provide:
    1. Margin recommendation (15-25%)
    2. Risk assessment
    3. Alternative supplier suggestions
    """,
    
    "compliance_check": """
    Check compliance for CAS {cas_number}:
    - REACH status
    - TSCA status
    - EPA status
    
    Return structured JSON with status and notes.
    """
}
```

## ACCIO Work Integration

```python
# shared-intelligence/src/accio.py

ACCIO_WORKFLOWS = {
    "supplier_discovery": {
        "trigger": "new_rfq_submitted",
        "actions": [
            "search_supplier_database",
            "crawl_external_sources",
            "rank_by_capability",
            "send_rfq_to_top_5"
        ]
    },
    
    "emergency_sourcing": {
        "trigger": "line_down_emergency",
        "actions": [
            "broadcast_to_all_suppliers",
            "activate_premium_network",
            "4_hour_response_required"
        ]
    }
}
```

---

# PART 7: DEPLOYMENT CHECKLIST

## Pre-Launch (Each Marketplace)

### Technical
- [ ] All API endpoints tested
- [ ] Baserow tables created with sample data
- [ ] Environment variables configured
- [ ] Stripe webhooks configured
- [ ] Firecrawl/Perplexity/Claude/ACCIO keys added
- [ ] Frontend build successful
- [ ] Backend tests passing
- [ ] Docker images built

### Business
- [ ] First 10 suppliers onboarded
- [ ] Pricing benchmarks established
- [ ] Compliance documentation templates ready
- [ ] Customer support workflow configured
- [ ] Refund/return policy defined

### Legal
- [ ] Terms of Service drafted
- [ ] Privacy Policy published
- [ ] Supplier Agreement signed
- [ ] Insurance coverage verified

## Post-Launch (Each Marketplace)

### Week 1
- [ ] Monitor error logs hourly
- [ ] Respond to all customer inquiries within 1 hour
- [ ] Daily standup to review metrics

### Month 1
- [ ] First 100 RFQs processed
- [ ] First 10 orders fulfilled
- [ ] Collect customer feedback
- [ ] Iterate on UX based on feedback

### Quarter 1
- [ ] Achieve $100K GMV
- [ ] 50 active buyers
- [ ] 25 verified suppliers
- [ ] Launch secondary revenue streams

---

# APPENDIX: QUICK REFERENCE

## Marketplace Directory

| # | Name | Domain | Framework | Primary Color | GMV Y3 |
|---|------|--------|-----------|---------------|--------|
| 1 | MRODirect | mrodirect.io | Medusa.js | #2563EB | $85M |
| 2 | ChemOS | cheemos.io | Saleor | #0ABFBC | $72M |
| 3 | BuildSource | buildsource.io | Medusa.js | #4B5563 | $68M |
| 4 | MedSupplyOS | medsupplyos.io | OroCommerce | #0EA5E9 | $61M |
| 5 | VoltSource | voltsource.io | Saleor | #EAB308 | $54M |
| 6 | LithiumBuy | lithiumbuy.com | Saleor+Custom | #3B82F6 | $48M |
| 7 | FoodOps | foodops.io | Medusa.js | #65A30D | $44M |
| 8 | PackSource | packsource.io | Medusa.js | #15803D | $38M |
| 9 | AgroOps | agroops.io | Medusa.js | #D97706 | $33M |
| 10 | LabSource | labsource.io | Saleor | #0891B2 | $28M |
| 11 | RigSource | rigsource.io | OroCommerce | #F59E0B | $26M |
| 12 | CareOps | careops.io | Baserow+Softr | #F59E0B | $22M |
| 13 | GovSource | govsource.io | OroCommerce | #1D4ED8 | $20M |
| 14 | SurplusOS | surplusos.io | Medusa+Custom | #EA580C | $18M |
| 15 | NetSource | netsource.io | Saleor | #7C3AED | $16M |
| 16 | SecureSource | securesource.io | Baserow+Medusa | #111827 | $13M |
| 17 | UniformOS | uniformos.io | Medusa.js | #1E3A5F | $11M |
| 18 | WorkspaceOS | workspaceos.io | OroCommerce | #D6B896 | $9M |
| 19 | IngredientOS | ingredientos.io | Saleor | #F59E0B | $8M |
| 20 | BarrelHub | barrelhub.io | Baserow+Softr | #92400E | $6M |

## Framework Distribution

| Framework | Count | Marketplaces |
|-----------|-------|--------------|
| Medusa.js | 8 | MRODirect, BuildSource, FoodOps, PackSource, AgroOps, SurplusOS, UniformOS, SecureSource |
| Saleor | 6 | ChemOS, VoltSource, LithiumBuy, LabSource, NetSource, IngredientOS |
| OroCommerce | 4 | MedSupplyOS, RigSource, GovSource, WorkspaceOS |
| Baserow+Softr | 2 | CareOps, BarrelHub |

## Revenue Tier Distribution

| Tier | GMV Range | Count | Marketplaces |
|------|-----------|-------|--------------|
| Tier 1 | $85M-$48M | 6 | Top 6 by revenue |
| Tier 2 | $44M-$20M | 8 | Middle 8 by revenue |
| Tier 3 | $18M-$6M | 6 | Bottom 6 by revenue |

---

*This superprompt provides complete instructions for building any marketplace in the Marketplace OS portfolio. Use the relevant section when building a specific marketplace, and refer to Part 1 (Universal Instructions) for all builds.*

**Portfolio: 20 B2B Marketplaces | Stack: React + FastAPI + Baserow + n8n**
**Data Intelligence: Firecrawl + Perplexity Sonar + Claude API + ACCIO Work**
**Total Portfolio GMV: $680M (Year 3) | Total Platform Revenue: $111M (Year 3)**
