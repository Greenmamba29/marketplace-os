# Marketplace OS - Individual Marketplace Profiles
## Quick Reference Cards for All 20 B2B Marketplaces

---

## 🔧 Tier 1: Highest Revenue ($85M - $48M GMV)

---

### #1 MRODirect — Industrial MRO Marketplace

```yaml
Identity:
  Domain: mrodirect.io
  Tagline: "The intelligent procurement platform for industrial maintenance"
  Primary Color: "#2563EB" (Steel Blue)
  Framework: Medusa.js
  
Market:
  TAM: "$700B global industrial MRO"
  Growth: "20.95% CAGR through 2031"
  Problem: "Grainger/Fastenal expensive and slow for SME manufacturers"
  
Target Customers:
  - Plant maintenance managers
  - Operations directors
  - Procurement teams (50-500 employee manufacturers)
  - Industries: automotive, aerospace, food processing
  
Financials (Year 3):
  GMV: $85M
  Avg Order Value: $2,400
  Order Frequency: 3.2x/month per buyer
  Take Rate: 14-18%
  Platform Revenue: $12M (primary) + $6.85M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $12M
  Secondary:
    - Supply chain financing (net-60): $2.5M
    - MRO supplies store: $1.8M
    - Emergency fulfillment (4hr): $950K
    - AI substitute recommendations: $600K
    
Key Features:
  1. Machine Profile Matching - "Find parts for my Haas VF-2"
  2. AI Substitute Recommendations - When parts out of stock
  3. Emergency Fulfillment - 4-hour line-down sourcing
  4. Supplier Contract Tiers - Volume-based pricing
  
Unique Tables:
  - PARTS_CATALOG (500K+ rows)
  - MACHINE_REGISTRY (buyer equipment)
  - SUPPLIER_CONTRACTS (tiered pricing)
  
Data Sources:
  Firecrawl:
    - Grainger product pages
    - RS Group catalog
    - Manufacturer parts databases
    - NIST component databases
  Sonar Queries:
    - "MRO supply chain disruptions Q2 2026"
    - "bearing lead times automotive sector"
    - "fastener pricing trends North America"
    
Build Priority: Month 1-2
Status: ✅ COMPLETE
Location: /apps/mrodirect/
```

---

### #2 ChemOS — Specialty Chemicals Marketplace

```yaml
Identity:
  Domain: cheemos.io
  Tagline: "The intelligence layer for specialty chemicals procurement"
  Primary Color: "#0ABFBC" (Teal)
  Framework: Saleor
  
Market:
  TAM: "$940B global specialty chemicals"
  Digitization: "Less than 15%"
  Moat: "REACH/TSCA/EPA compliance layer"
  
Target Customers:
  - Procurement managers
  - R&D chemists
  - QA/compliance officers
  - Plant engineers
  - Sustainability managers
  
Financials (Year 3):
  GMV: $72M
  Avg Order Value: $18,500
  Order Frequency: Monthly recurring
  Take Rate: 18-22%
  Platform Revenue: $14M (primary) + $8.8M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $14M
  Secondary:
    - Compliance-as-a-Service: $3.6M
    - Supply chain financing: $2.2M
    - Price index subscription: $1.2M
    - AI compliance reports: $800K
    
Key Features:
  1. CAS Number Lookup Tool - 12,400+ pages for SEO
  2. AI-Generated Compliance Reports - REACH/TSCA/EPA
  3. Live Price Index - Historical with trends
  4. ACCIO Autonomous Sourcing - Natural language
  
Unique Tables:
  - COMPLIANCE_REGISTRY (per CAS)
  - MARKET_INTELLIGENCE (weekly reports)
  - REGULATORY_ALERTS (EPA/REACH changes)
  
Data Sources:
  Firecrawl:
    - ECHA chemical database
    - EPA TSCA inventory
    - chemicaldirectory.com
    - ICIS pricing pages
  Sonar Queries:
    - "specialty chemical price trends [category] 2026"
    - "REACH regulation updates Q1 2026"
    - "acetone supply tightness North America"
    
Build Priority: Month 1-2
Status: ✅ COMPLETE
Location: /apps/cheemos/
```

---

### #3 BuildSource — Construction Materials Marketplace

```yaml
Identity:
  Domain: buildsource.io
  Tagline: "Project-based procurement for construction professionals"
  Primary Color: "#4B5563" (Concrete Gray)
  Accent Color: "#F97316" (Orange)
  Framework: Medusa.js
  
Market:
  TAM: "$1.5T global construction materials"
  Problem: "Hyperlocal, opaque, phone-driven procurement"
  Gap: "No dominant digital marketplace in North America"
  
Target Customers:
  - General contractors
  - Project managers
  - Procurement directors ($10M-$500M revenue firms)
  
Financials (Year 3):
  GMV: $68M
  Avg Order Value: $34,000
  Order Frequency: 2-4x per project phase
  Take Rate: 8-12%
  Platform Revenue: $6.8M (primary) + $6.2M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $6.8M
  Secondary:
    - Project finance (invoice factoring): $2.7M
    - Logistics coordination: $1.4M
    - LEED certification tracking: $900K
    - Bulk testing certification: $600K
    
Key Features:
  1. Project-Based Procurement - All materials tracked together
  2. Regional Supplier Optimization - Minimize haul distance
  3. LEED Material Tracking Dashboard - MR credits
  4. Emergency Delivery Sourcing - Critical deadlines
  
Unique Tables:
  - PROJECTS (construction jobs)
  - REGIONAL_AVAILABILITY (zip code inventory)
  - SPEC_SHEETS (ASTM/ACI docs)
  
Data Sources:
  Firecrawl:
    - RS Means pricing database
    - ENR cost indices
    - Regional supplier websites
    - Material Bank
  Sonar Queries:
    - "ready-mix concrete prices [metro area]"
    - "steel rebar supply Q2 2026"
    - "lumber price forecast 2026"
    
Build Priority: Month 4
Status: ✅ COMPLETE
Location: /apps/buildsource/
```

---

### #4 MedSupplyOS — Healthcare Equipment & MRO

```yaml
Identity:
  Domain: medsupplyos.io
  Tagline: "FDA-compliant procurement for healthcare systems"
  Primary Color: "#0EA5E9" (Clinical Blue)
  Accent Color: "#FFFFFF" (White)
  Framework: OroCommerce
  
Market:
  TAM: "$400B healthcare MRO"
  Growth: "22.35% CAGR (fastest-growing B2B vertical)"
  Gap: "40% of hospital purchases outside GPO contracts"
  
Target Customers:
  - Materials managers
  - Supply chain directors
  - Biomedical engineers
  - Hospitals, surgical centers, diagnostic labs
  
Financials (Year 3):
  GMV: $61M
  Avg Order Value: $8,200
  Order Frequency: 2.1x/month per account
  Take Rate: 15-20%
  Platform Revenue: $10.7M (primary) + $6.5M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $10.7M
  Secondary:
    - FDA compliance documentation: $2.4M
    - GPO bypass analytics: $1.8M
    - Equipment maintenance contracts: $1.2M
    - Emergency sourcing: $900K
    
Key Features:
  1. UDI-Compliant Order Tracking - GS1-128/DataMatrix
  2. FDA Clearance Verification - Real-time 510(k) lookup
  3. GPO Price Benchmarking - Savings visibility
  4. Corporate Account Hierarchies - Health system → hospital → dept
  
Unique Tables:
  - FACILITIES (hospital/clinic registry)
  - REGULATORY_CLEARANCES (FDA 510(k), PMA, CE)
  - GPO_CONTRACTS (pricing tiers)
  - BIOMEDICAL_EQUIPMENT (installed base)
  
Data Sources:
  Firecrawl:
    - FDA device database
    - Hospital GPO directories
    - ECRI Institute evaluations
    - Premier/Vizient contracts
  Sonar Queries:
    - "healthcare supply chain shortages 2026"
    - "surgical instrument pricing trends"
    - "FDA device clearance backlog"
    
Build Priority: Month 5-6
Status: ✅ COMPLETE
Location: /apps/medsupplyos/
```

---

### #5 VoltSource — EV & Clean Energy Components

```yaml
Identity:
  Domain: voltsource.io
  Tagline: "IRA-compliant sourcing for the energy transition"
  Primary Color: "#EAB308" (Electric Yellow)
  Framework: Saleor
  
Market:
  TAM: "$150B growing at 25%+ CAGR"
  Catalyst: "CHIPS Act + IRA = $630B domestic manufacturing"
  Gap: "No established digital procurement channel"
  
Target Customers:
  - Procurement engineers
  - Supply chain managers
  - Project developers (EV, solar, battery, grid storage)
  
Financials (Year 3):
  GMV: $54M
  Avg Order Value: $42,000
  Order Frequency: Monthly (project-driven)
  Take Rate: 10-14%
  Platform Revenue: $6.5M (primary) + $5.1M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $6.5M
  Secondary:
    - IRA compliance documentation: $2.2M
    - Supply chain risk monitoring: $1.5M
    - Carbon footprint tracking: $800K
    - Battery chemistry matching: $600K
    
Key Features:
  1. IRA Domestic Content Calculator - Automatic per order
  2. SVHC/RoHS Compliance Verification - Certification tracking
  3. Supply Chain Risk Score - Per supplier assessment
  4. Battery Chemistry Matching - NMC/LFP/NCA specs
  
Unique Tables:
  - IRA_COMPLIANCE_TRACKER (domestic content %)
  - SUPPLY_CHAIN_RISK (geopolitical flags)
  - CERTIFICATION_REGISTRY (UL, IEC, DoE)
  
Data Sources:
  Firecrawl:
    - DoE EERE databases
    - UL product certification
    - BloombergNEF pricing
    - Solar/storage trade publications
  Sonar Queries:
    - "lithium battery cell prices Q2 2026"
    - "IRA domestic content requirements latest"
    - "solar panel supply chain China tariffs"
    
Build Priority: Month 4
Status: ✅ COMPLETE
Location: /apps/voltsource/
```

---

### #6 LithiumBuy — Lithium Materials Marketplace

```yaml
Identity:
  Domain: lithiumbuy.com
  Tagline: "The Bloomberg of lithium — spot prices, contracts, and sourcing"
  Primary Color: "#3B82F6" (Lithium Blue)
  Framework: Saleor + Custom FastAPI Pricing Engine
  
Market:
  TAM: "Spot market with zero digital standard"
  Assets: "Existing brand and domain established"
  Focus: "Lithium carbonate, hydroxide, spodumene"
  
Target Customers:
  - Battery manufacturers
  - Cathode material producers
  - Energy storage developers
  - EV OEM procurement teams
  
Financials (Year 3):
  GMV: $48M
  Avg Order Value: $285,000 (metric ton pricing)
  Order Frequency: Quarterly contract + monthly spot
  Take Rate: 3-6% on spot
  Platform Revenue: $2.4M (primary) + $4.5M (secondary)
  
Revenue Streams:
  Primary:
    - Spot trading spread: $2.4M
  Secondary:
    - Price index subscription: $1.8M
    - Supply chain risk reports: $1.2M
    - Contract management: $900K
    - Hedging advisory: $600K
    
Key Features:
  1. Live Price Index - Real-time lithium spot prices
  2. Supply Tightness Alerts - Market condition notifications
  3. IRA-Compliant Source Certification - Domestic tracking
  4. Contract Term Management - Quarterly + spot workflows
  
Unique Tables:
  - SPOT_PRICE_HISTORY (daily prices)
  - MINE_REGISTRY (producing mines)
  - CONTRACT_TERMS (long-term offtake)
  - GEOPOLITICAL_RISK (country scores)
  
Data Sources:
  Firecrawl:
    - Fastmarkets lithium prices
    - Benchmark Mineral Intelligence
    - S&P Global Commodity Insights
    - Mining company IR pages
  Sonar Queries:
    - "lithium carbonate spot price today"
    - "China lithium export policy 2026"
    - "Australian spodumene mine output Q1 2026"
    
Build Priority: Month 3
Status: ✅ COMPLETE
Location: /apps/lithiumbuy/
```

---

## 🌾 Tier 2: Medium Revenue ($44M - $20M GMV)

---

### #7 FoodOps — Commercial Food Distribution

```yaml
Identity:
  Domain: foodops.io
  Tagline: "Menu-based procurement for restaurants and institutions"
  Primary Color: "#65A30D" (Warm Olive)
  Framework: Medusa.js + Custom Cold Chain Module
  
Market:
  TAM: "$400B commercial food distribution"
  Incumbents: "Sysco and US Foods dominate"
  Gap: "SME restaurants pay retail-adjacent prices"
  
Target Customers:
  - Executive chefs
  - F&B directors
  - Purchasing managers (restaurants, hotels, healthcare, universities)
  
Financials (Year 3):
  GMV: $44M
  Avg Order Value: $3,800
  Order Frequency: 2.3x/week (perishables) + 1x/month (dry)
  Take Rate: 6-10%
  Platform Revenue: $3.5M (primary) + $4.7M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $3.5M
  Secondary:
    - Demand forecasting-as-a-Service: $1.8M
    - FSMA compliance documentation: $1.3M
    - Cold chain monitoring: $900K
    - Menu engineering tools: $600K
    
Key Features:
  1. Menu-Based Procurement - Generate orders from weekly menu
  2. AI Demand Forecasting - Predict usage from history
  3. FSMA Lot Traceability Dashboard - One-up-one-back
  4. Cold Chain Temperature Monitoring - Real-time tracking
  
Unique Tables:
  - MENU_ENGINEERING (menu → ingredients)
  - LOT_TRACKING (FSMA compliance)
  - ALLERGEN_REGISTRY (allergen matrix)
  - TEMPERATURE_LOGS (cold chain)
  
Data Sources:
  Firecrawl:
    - USDA market news price reports
    - Regional food distributor websites
    - FDA FSMA inspection databases
  Sonar Queries:
    - "commodity food prices 2026"
    - "FSMA traceability rule enforcement"
    - "restaurant supply chain disruptions"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/foodops/
```

---

### #8 PackSource — Packaging Materials Marketplace

```yaml
Identity:
  Domain: packsource.io
  Tagline: "Sustainable packaging procurement with sample fulfillment"
  Primary Color: "#15803D" (Forest Green)
  Framework: Medusa.js
  
Market:
  TAM: "$200B global packaging market"
  Trend: "61% of specs require sustainable/recyclable materials"
  Gap: "No dominant digital B2B marketplace"
  
Target Customers:
  - Packaging engineers
  - Product managers
  - Procurement leads (CPG, e-commerce, food, pharma)
  
Financials (Year 3):
  GMV: $38M
  Avg Order Value: $12,400
  Order Frequency: Quarterly (launches) + monthly (replenishment)
  Take Rate: 10-14%
  Platform Revenue: $4.6M (primary) + $4.1M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $4.6M
  Secondary:
    - Sustainability certification: $1.4M
    - Custom printing management: $1.1M
    - Sample fulfillment: $900K
    - EPR compliance tracking: $600K
    
Key Features:
  1. Sustainability Score on Every SKU - LCA data, PCR%
  2. Sample-Before-You-Commit Workflow - Free samples
  3. Custom Packaging Brief-to-Quote - 48 hours via ACCIO
  4. EPR Compliance Tracking - By state
  
Unique Tables:
  - DESIGN_FILES (3D die-cut, flat art)
  - SUSTAINABILITY_SCORES (LCA data)
  - SAMPLE_REQUESTS (tracking)
  - PRINT_SPECS (color, substrate)
  
Data Sources:
  Firecrawl:
    - FINAT label industry pricing
    - Packaging Digest market reports
    - EcoVadis certification database
    - How2Recycle database
  Sonar Queries:
    - "sustainable packaging material costs 2026"
    - "corrugated board prices North America"
    - "extended producer responsibility regulations"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/packsource/
```

---

### #9 AgroOps — Agri-Inputs & Farm Supplies

```yaml
Identity:
  Domain: agroops.io
  Tagline: "Agronomic intelligence for modern farming operations"
  Primary Color: "#D97706" (Field Gold)
  Framework: Medusa.js
  
Market:
  TAM: "$250B global agri-inputs"
  Structure: "Highly fragmented regionally"
  Problem: "Zero price transparency through local co-ops"
  
Target Customers:
  - Large farms (500+ acres)
  - Agribusiness procurement managers
  - Farm management companies
  - Ag co-op purchasing directors
  
Financials (Year 3):
  GMV: $33M
  Avg Order Value: $22,000
  Order Frequency: Seasonal (2-3 purchases per growing season)
  Take Rate: 8-12%
  Platform Revenue: $3.6M (primary) + $3.6M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $3.6M
  Secondary:
    - Crop input financing (net-90): $1.3M
    - Agronomy consultation: $900K
    - Weather-adjusted forecasting: $700K
    - State registration compliance: $500K
    
Key Features:
  1. Agronomic Recommendation Engine - Crop + soil + weather
  2. State Registration Compliance - EPA + state tracking
  3. Ag Credit Terms - Net-90 for seasonal cash flow
  4. Weather-Adjusted Demand Forecasting - Optimal timing
  
Unique Tables:
  - CROP_REGISTRY (planted acres, soil)
  - EPA_REGISTRATIONS (state-by-state)
  - WEATHER_INTEGRATION (NOAA data)
  - SEASONAL_FORECASTS (price forecasts)
  
Data Sources:
  Firecrawl:
    - USDA NASS agricultural prices
    - EPA pesticide registration database
    - State agriculture portals
  Sonar Queries:
    - "fertilizer prices North America planting season 2026"
    - "crop protection chemical supply tightness"
    - "USDA commodity price forecasts"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/agroops/
```

---

### #10 LabSource — Laboratory & Life Sciences

```yaml
Identity:
  Domain: labsource.io
  Tagline: "Lot-tracked procurement for regulated research"
  Primary Color: "#0891B2" (Science Teal)
  Framework: Saleor
  
Market:
  TAM: "$60B laboratory supplies"
  Driver: "Post-pandemic supply chain resilience is C-suite priority"
  Moat: "GMP compliance and traceability"
  
Target Customers:
  - Lab managers
  - Research directors
  - Purchasing coordinators (pharma R&D, biotech, CROs, universities)
  
Financials (Year 3):
  GMV: $28M
  Avg Order Value: $4,600
  Order Frequency: 2.8x per month
  Take Rate: 14-18%
  Platform Revenue: $4.2M (primary) + $3.7M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $4.2M
  Secondary:
    - Cold chain tracking service: $1.2M
    - CLIA compliance documentation: $900K
    - Grant procurement support: $700K
    - Lot-tracked delivery premium: $600K
    
Key Features:
  1. Lot-Tracked Delivery - CoA before every shipment
  2. Cold Chain Temperature Monitoring - Excursion alerts
  3. Grant Procurement Compliance Records - NSF/NIH
  4. Substitute Recommendations - AI-powered alternatives
  
Unique Tables:
  - LOT_REGISTRY (CoA per lot)
  - COLD_CHAIN_COMPLIANCE (temp logs)
  - GRANT_PROCUREMENT (NSF/NIH links)
  - CLIA_REGISTRY (waived products)
  
Data Sources:
  Firecrawl:
    - Fisher Scientific catalog pricing
    - Sigma-Aldrich pricing
    - CLIA waiver databases
    - NIH reagent program
  Sonar Queries:
    - "laboratory reagent supply shortages 2026"
    - "biosafety cabinet availability lead times"
    - "PCR reagent pricing trends"
    
Build Priority: Month 5-6
Status: ✅ COMPLETE
Location: /apps/labsource/
```

---

### #11 RigSource — Freight & Heavy Equipment

```yaml
Identity:
  Domain: rigsource.io
  Tagline: "Fleet procurement for logistics professionals"
  Primary Color: "#F59E0B" (Heavy Equipment Yellow)
  Framework: OroCommerce
  
Market:
  TAM: "$90B freight trailer and heavy equipment"
  Structure: "Wabash, Great Dane control new; resale fragmented"
  Gap: "No managed marketplace for fleet procurement"
  
Target Customers:
  - Fleet managers
  - Logistics companies
  - Equipment rental firms
  - Owner-operators
  
Financials (Year 3):
  GMV: $26M
  Avg Order Value: $68,000 (purchase) / $4,200/month (rental)
  Order Frequency: Annual fleet refresh + monthly rentals
  Take Rate: 8-10% purchase / 12% rental
  Platform Revenue: $3.3M (primary) + $2.9M (secondary)
  
Revenue Streams:
  Primary:
    - Purchase spread: $1.8M
    - Rental fees: $1.5M
  Secondary:
    - Fleet management SaaS: $900K
    - DOT compliance verification: $700K
    - Title/lien verification: $500K
    - Equipment financing: $400K
    
Key Features:
  1. Fleet Purchase Order Management - Multi-unit workflows
  2. Equipment Condition Grading - Standardized assessments
  3. DOT Inspection Status Tracking - FMCSA integration
  4. Title/Lien Verification - Document validation
  
Unique Tables:
  - FLEET_REGISTRY (fleet profiles)
  - FLEET_UNITS (individual vehicles)
  - EQUIPMENT_INSPECTIONS (DOT records)
  - TITLE_REGISTRY (lien checks)
  
Data Sources:
  Firecrawl:
    - Commercial Truck Trader listings
    - TruckPaper pricing
    - FMCSA SAFER database
    - EquipmentWatch valuation
  Sonar Queries:
    - "commercial truck prices 2026"
    - "trailer manufacturing lead times"
    - "FMCSA compliance requirements updates"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/rigsource/
```

---

### #12 CareOps — Home Care & Staffing

```yaml
Identity:
  Domain: careops.io
  Tagline: "Verified caregiver matching for families and payers"
  Primary Color: "#F59E0B" (Warm Amber)
  Framework: Baserow + Softr (MVP)
  
Market:
  TAM: "$125B home care market"
  Structure: "Primarily offline"
  Opportunity: "Worker-owned care cooperatives underserved"
  
Target Customers:
  - Hospital discharge planners
  - Managed care organizations
  - Private pay families
  - Corporate HR benefits managers
  
Financials (Year 3):
  GMV: $22M
  Avg Order Value: $3,200/month (ongoing care contract)
  Order Frequency: Subscription-style recurring
  Take Rate: 10-12% on care hours billed
  Platform Revenue: $2.4M (primary) + $2.6M (secondary)
  
Revenue Streams:
  Primary:
    - Care hours commission: $2.4M
  Secondary:
    - Worker training certification: $800K
    - Care coordination SaaS: $700K
    - Background check fees: $500K
    - Insurance authorization management: $400K
    
Key Features:
  1. Caregiver Profile Search - Certifications, languages, specializations
  2. Care Plan Builder - Hours/week, specific needs
  3. Scheduling System - Calendar integration
  4. Background Check Integration - Checkr/Sterling API
  
Unique Tables:
  - CAREGIVER_PROFILES (supply side)
  - CARE_PLANS (buyer requirements)
  - BACKGROUND_CHECKS (integration)
  - PAYER_AUTHORIZATIONS (insurance)
  - SCHEDULES (assignments)
  
Data Sources:
  Firecrawl:
    - State caregiver registries
    - Training certification databases
    - Medicaid waiver directories
  Sonar Queries:
    - "home care worker wages 2026"
    - "Medicaid home care policy updates"
    - "caregiver shortage trends"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/careops/
```

---

### #13 GovSource — Government Procurement

```yaml
Identity:
  Domain: govsource.io
  Tagline: "FAR-compliant vendor matching for government buyers"
  Primary Color: "#1D4ED8" (Federal Blue)
  Framework: OroCommerce
  
Market:
  TAM: "$120B government procurement"
  Problem: "SAM.gov and state portals compliance-gated but slow"
  Opportunity: "Pre-qualified vendor marketplace"
  
Target Customers:
  - Government procurement officers
  - Small business contracting officers
  - Agency program managers (federal, state, municipal)
  - Set-aside eligible vendors
  
Financials (Year 3):
  GMV: $20M
  Avg Order Value: $85,000
  Order Frequency: Quarterly RFP cycles
  Take Rate: 3-6% (lower rate, compliance premium)
  Platform Revenue: $1M (primary) + $2.5M (secondary)
  
Revenue Streams:
  Primary:
    - Transaction fee: $1M
  Secondary:
    - SAM.gov compliance automation: $600K
    - Set-aside program management: $500K
    - FAR/DFARS documentation: $400K
    - Security clearance verification: $300K
    - Performance bond facilitation: $200K
    
Key Features:
  1. Vendor Pre-Qualification - Automated SAM.gov verification
  2. FAR/DFARS Compliance Automation - Documentation generation
  3. RFP-to-Supplier Matching - Capability-based
  4. Set-Aside Eligibility Tracking - 8(a), HUBZone, SDVOSB, WOSB
  
Unique Tables:
  - VENDOR_QUALIFICATIONS (certifications)
  - RFP_REGISTRY (opportunities)
  - FAR_COMPLIANCE (clause tracking)
  - SET_ASIDE_TRACKING (eligibility)
  
Data Sources:
  Firecrawl:
    - SAM.gov entity registrations
    - GSA Schedule contract pages
    - Agency procurement forecasts
    - SBA certification databases
  Sonar Queries:
    - "government procurement policy updates 2026"
    - "federal contracting spending trends"
    - "small business set-aside changes"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/govsource/
```

---

### #14 SurplusOS — Surplus & Salvage Assets

```yaml
Identity:
  Domain: surplusos.io
  Tagline: "AI-powered asset liquidation with guaranteed fulfillment"
  Primary Color: "#EA580C" (Industrial Orange)
  Framework: Medusa.js + Custom Auction Engine
  
Market:
  TAM: "$30B surplus and salvage assets"
  Incumbents: "Copart and Liquidity Services dominate"
  Gap: "No AI valuation or managed fulfillment"
  
Target Customers:
  - Corporate asset managers
  - Plant closures teams
  - Insurance adjusters
  - Manufacturing companies liquidating equipment
  
Financials (Year 3):
  GMV: $18M
  Avg Order Value: $12,400
  Order Frequency: Quarterly liquidation events
  Take Rate: 18-22% (highest in portfolio)
  Platform Revenue: $3.6M (primary) + $2.9M (secondary)
  
Revenue Streams:
  Primary:
    - Transaction fee: $3.6M
  Secondary:
    - AI valuation service: $900K
    - Title transfer management: $600K
    - Logistics coordination: $500K
    - Auction premium: $400K
    - Asset storage: $300K
    
Key Features:
  1. AI-Powered Asset Valuation - From uploaded photos
  2. Condition Grading - Objective assessment
  3. Live Auction Engine - Real-time bidding
  4. Title Transfer Management - Document workflow
  
Unique Tables:
  - ASSET_VALUATIONS (AI assessments)
  - AUCTIONS (live bidding)
  - BIDS (bid history)
  - TITLE_TRANSFERS (document workflow)
  - LOGISTICS (shipping coordination)
  
Data Sources:
  Firecrawl:
    - Copart auction results
    - Liquidity Services listings
    - EquipmentWatch valuation
    - Industry auction aggregators
  Sonar Queries:
    - "industrial equipment resale values 2026"
    - "plant closure asset liquidation trends"
    - "used machinery market conditions"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/surplusos/
```

---

## 💼 Tier 3: Lower Revenue ($18M - $6M GMV)

---

### #15 NetSource — Telecom & Network Hardware

```yaml
Identity:
  Domain: netsource.io
  Tagline: "Authentic network hardware with warranty passthrough"
  Primary Color: "#7C3AED" (Network Purple)
  Framework: Saleor
  
Market:
  TAM: "$95B telecom infrastructure"
  Problem: "Reseller market opaque, gray-market-prone, fragmented"
  Gap: "No authenticity verification platform"
  
Target Customers:
  - Network engineers
  - IT procurement managers
  - MSPs sourcing switching, routing, optical, wireless
  
Financials (Year 3):
  GMV: $16M
  Avg Order Value: $28,000
  Order Frequency: Quarterly refresh cycles
  Take Rate: 10-14%
  Platform Revenue: $1.9M (primary) + $1.7M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $1.9M
  Secondary:
    - Authenticity verification: $600K
    - Warranty passthrough: $500K
    - NDAA compliance checking: $400K
    - End-of-life alerts: $300K
    
Key Features:
  1. Hardware Authenticity Verification - Serial number validation
  2. Warranty Passthrough Tracking - Full support transfer
  3. NDAA Compliance Checking - Section 889 banned manufacturers
  4. End-of-Life Status Alerts - EOS/EOL notifications
  
Unique Tables:
  - AUTHENTICITY_RECORDS (verification history)
  - WARRANTY_REGISTRY (support transfers)
  - NDAA_COMPLIANCE (banned manufacturers)
  - EOL_TRACKING (lifecycle status)
  
Data Sources:
  Firecrawl:
    - Cisco product documentation
    - Juniper support portals
    - Nokia hardware databases
    - GSA Advantage pricing
  Sonar Queries:
    - "network equipment supply chain 2026"
    - "Cisco switch pricing trends"
    - "telecom infrastructure spending forecast"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/netsource/
```

---

### #16 SecureSource — Security & Surveillance

```yaml
Identity:
  Domain: securesource.io
  Tagline: "Security equipment + certified installer matching"
  Primary Color: "#111827" (Security Black)
  Framework: Baserow + Medusa.js Hybrid
  
Market:
  TAM: "$50B security systems market"
  Problem: "Hardware and installation both fragmented"
  Gap: "No marketplace handles both"
  
Target Customers:
  - Corporate security managers
  - Facilities directors
  - Property managers (commercial RE, retail, logistics)
  
Financials (Year 3):
  GMV: $13M
  Avg Order Value: $22,000 (equipment + installation)
  Order Frequency: Annual security upgrades
  Take Rate: 12%
  Platform Revenue: $1.4M (primary) + $1.2M (secondary)
  
Revenue Streams:
  Primary:
    - Equipment + installation: $1.4M
  Secondary:
    - Installer matching fee: $400K
    - Monitoring service integration: $300K
    - Maintenance contracts: $250K
    - Site assessment: $200K
    
Key Features:
  1. Security Equipment Catalog - Cameras, access control, alarms
  2. Certified Installer Matching - By location/specialization
  3. Equipment + Installation Bundling - Single workflow
  4. Installer Certification Verification - License validation
  
Unique Tables:
  - INSTALLER_PROFILES (certified installers)
  - INSTALLATION_PROJECTS (job tracking)
  - CERTIFICATIONS (license verification)
  - SERVICE_AREAS (geographic coverage)
  
Data Sources:
  Firecrawl:
    - Manufacturer installer directories
    - State licensing databases
    - Security industry certification bodies
  Sonar Queries:
    - "security system installation costs 2026"
    - "video surveillance market trends"
    - "access control technology updates"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/securesource/
```

---

### #17 UniformOS — B2B Apparel & Uniforms

```yaml
Identity:
  Domain: uniformos.io
  Tagline: "Corporate uniform programs with custom embellishment"
  Primary Color: "#1E3A5F" (Corporate Navy)
  Framework: Medusa.js with Custom Size Matrix
  
Market:
  TAM: "$45B B2B uniform and workwear"
  Problem: "No price transparency or digital catalog standardization"
  Gap: "Custom branding complexity deters digitization"
  
Target Customers:
  - HR managers
  - Operations directors
  - Uniform coordinators (healthcare, hospitality, manufacturing)
  
Financials (Year 3):
  GMV: $11M
  Avg Order Value: $8,400 (initial kit) + $2,200/year recurring
  Order Frequency: Annual setup + quarterly replenishment
  Take Rate: 12-15%
  Platform Revenue: $1.3M (primary) + $1.15M (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $1.3M
  Secondary:
    - Embellishment services: $400K
    - Size matrix management: $200K
    - Program administration: $180K
    - Rush order processing: $150K
    
Key Features:
  1. Size Matrix Configurator - XS-4XL + tall/short variants
  2. Embellishment Options - Embroidery, screen print, heat transfer
  3. Pantone Color Matching - Brand consistency
  4. Minimum Order Tracking - Per style requirements
  
Unique Tables:
  - SIZE_MATRICES (complex sizing)
  - EMBELLISHMENT_OPTIONS (decoration types)
  - PANTONE_MATCHES (color library)
  - DECORATION_SPECS (artwork requirements)
  
Data Sources:
  Firecrawl:
    - Apparel manufacturer catalogs
    - Embroidery digitization services
    - Pantone color libraries
  Sonar Queries:
    - "corporate uniform program costs 2026"
    - "workwear fabric technology trends"
    - "hospitality uniform design trends"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/uniformos/
```

---

### #18 WorkspaceOS — Office Fit-Out & Furniture

```yaml
Identity:
  Domain: workspaceos.io
  Tagline: "Project-based procurement for office transformations"
  Primary Color: "#D6B896" (Warm Sand)
  Framework: OroCommerce
  
Market:
  TAM: "$35B contract furniture"
  Structure: "Steelcase, Herman Miller, Knoll control tier-1"
  Gap: "SME fit-out market ($50K-$500K) underserved"
  
Target Customers:
  - Office managers
  - HR directors
  - Facilities managers (tech companies, co-working, CRE)
  
Financials (Year 3):
  GMV: $9M
  Avg Order Value: $68,000 (full floor fit-out)
  Order Frequency: Bi-annual office moves
  Take Rate: 10-14%
  Platform Revenue: $1M (primary) + $900K (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $1M
  Secondary:
    - Design service integration: $300K
    - Project management: $200K
    - Installation coordination: $180K
    - Lease return management: $120K
    
Key Features:
  1. Project-Based Procurement - Full floor fit-out workflow
  2. Complex Approval Routing - Multi-stakeholder sign-off
  3. Design Service Integration - Professional designer matching
  4. Floor Plan Management - Upload and visualization
  
Unique Tables:
  - PROJECTS (fit-out jobs)
  - FLOOR_PLANS (uploaded layouts)
  - DESIGN_SERVICES (designer network)
  - INSTALLATION_SCHEDULES (delivery coordination)
  
Data Sources:
  Firecrawl:
    - Steelcase dealer pricing
    - Herman Miller contract terms
    - Knoll product specifications
  Sonar Queries:
    - "office furniture pricing trends 2026"
    - "workplace design trends post-pandemic"
    - "commercial real estate fit-out costs"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/workspaceos/
```

---

### #19 IngredientOS — Specialty Food & Beverage Ingredients

```yaml
Identity:
  Domain: ingredientos.io
  Tagline: "Clean label ingredient sourcing for food innovators"
  Primary Color: "#F59E0B" (Saffron)
  Framework: Saleor
  
Market:
  TAM: "$50B specialty food ingredients"
  Driver: "Clean label and functional ingredient trends"
  Gap: "No market pricing data from fragmented distributors"
  
Target Customers:
  - R&D food scientists
  - Procurement managers
  - Founders (specialty food, nutraceutical, contract manufacturing)
  
Financials (Year 3):
  GMV: $8M
  Avg Order Value: $6,200
  Order Frequency: Monthly product development cycles
  Take Rate: 12-16%
  Platform Revenue: $1.1M (primary) + $970K (secondary)
  
Revenue Streams:
  Primary:
    - Managed spread: $1.1M
  Secondary:
    - GRAS status verification: $300K
    - Certification management: $200K
    - Allergen documentation: $150K
    - Functional claims support: $120K
    
Key Features:
  1. GRAS Status Verification - FDA database lookup
  2. Non-GMO/Organic Certification Tracking - Certificate validation
  3. Allergen Declaration Management - Compliance docs
  4. Functional Claims Documentation - Regulatory support
  
Unique Tables:
  - REGULATORY_STATUS (GRAS tracking)
  - CERTIFICATIONS (organic/non-GMO)
  - ALLERGEN_PROFILES (ingredient matrices)
  - FUNCTIONAL_CLAIMS (regulatory support)
  
Data Sources:
  Firecrawl:
    - FDA GRAS notice database
    - USDA organic certification
    - Non-GMO Project verified list
  Sonar Queries:
    - "specialty food ingredient trends 2026"
    - "clean label movement updates"
    - "functional food ingredient market"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/ingredientos/
```

---

### #20 BarrelHub — Bulk Whiskey & Spirits

```yaml
Identity:
  Domain: barrelhub.io
  Tagline: "The marketplace for bulk aged spirits"
  Primary Color: "#92400E" (Bourbon Amber)
  Framework: Baserow + Softr (MVP)
  
Market:
  TAM: "$8B bulk spirits market"
  Validation: "Barrel Hub proved the model"
  Problem: "Opaque pricing for bulk aged whiskey, bourbon, spirits"
  
Target Customers:
  - Craft spirits brands (buyers)
  - Distilleries with surplus inventory (sellers)
  - Non-distiller producers (NDPs)
  - Spirits investment funds
  
Financials (Year 3):
  GMV: $6M
  Avg Order Value: $48,000 (barrel lot or bulk)
  Order Frequency: Quarterly transactions
  Take Rate: 8-12%
  Platform Revenue: $600K (primary) + $650K (secondary)
  
Revenue Streams:
  Primary:
    - Transaction fee: $600K
  Secondary:
    - Barrel storage fees: $200K
    - TTB compliance documentation: $150K
    - Sensory evaluation services: $120K
    - Market comparable reports: $100K
    
Key Features:
  1. Individual Barrel Tracking - By barrel number, entry date
  2. TTB Permit Verification - Automated compliance checking
  3. Sensory Evaluation Scores - Professional tasting notes
  4. Market Comparable Transactions - Recent pricing data
  
Unique Tables:
  - BARREL_REGISTRY (individual barrels)
  - TTB_COMPLIANCE (permit verification)
  - SENSORY_PROFILES (tasting notes)
  - MARKET_COMPS (comparable transactions)
  
Data Sources:
  Firecrawl:
    - TTB distillery permits
    - Spirits industry publications
    - Distillery auction results
  Sonar Queries:
    - "bulk whiskey prices 2026"
    - "bourbon barrel market trends"
    - "craft spirits industry forecast"
    
Build Priority: Month 7-12
Status: ✅ COMPLETE
Location: /apps/barrelhub/
```

---

## 📊 Portfolio Summary

### By Revenue Tier

| Tier | GMV Range | Count | Marketplaces | Combined GMV |
|------|-----------|-------|--------------|--------------|
| **Tier 1** | $85M-$48M | 6 | Top 6 | $390M |
| **Tier 2** | $44M-$20M | 8 | Middle 8 | $224M |
| **Tier 3** | $18M-$6M | 6 | Bottom 6 | $66M |
| **TOTAL** | | **20** | | **$680M** |

### By Framework

| Framework | Count | Marketplaces |
|-----------|-------|--------------|
| Medusa.js | 8 | MRODirect, BuildSource, FoodOps, PackSource, AgroOps, SurplusOS, UniformOS, SecureSource |
| Saleor | 6 | ChemOS, VoltSource, LithiumBuy, LabSource, NetSource, IngredientOS |
| OroCommerce | 4 | MedSupplyOS, RigSource, GovSource, WorkspaceOS |
| Baserow+Softr | 2 | CareOps, BarrelHub |

### Revenue Mix (Portfolio)

```
Primary Revenue (Managed Spread):    79%  ($88M)
Supply Chain Financing:               8%  ($9M)
Compliance-as-a-Service:              5%  ($5.5M)
SaaS Subscriptions:                   4%  ($4.5M)
Premium Services:                     4%  ($4M)
```

---

**Portfolio: 20 B2B Marketplaces | Total GMV: $680M (Year 3) | Total Revenue: $111M (Year 3)**
