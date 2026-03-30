# Marketplace OS — Setup & Deploy Guide

## Prerequisites checklist

Before running anything, make sure you have:

- [ ] Node.js 20+ (`node -v`)
- [ ] Python 3.12+ (`python3 --version`)
- [ ] Git (`git --version`)
- [ ] GitHub CLI (`brew install gh`)
- [ ] Netlify CLI (`npm install -g netlify-cli`)
- [ ] A Stripe account (free) → https://dashboard.stripe.com

---

## Step 0 — Fix the hung terminal (do this FIRST)

If your terminal is hanging on every command, the Webflow CLI is blocking it.
Run this in a NEW terminal window:

```bash
# Option A: Kill the blocking process
pkill -f "warp-config" 2>/dev/null
pkill -f "webflow-cli" 2>/dev/null

# Option B: Open a clean shell without profile scripts
env -i HOME="$HOME" PATH="/usr/local/bin:/usr/bin:/bin" bash --noprofile --norc

# Option C: Use a different shell profile
zsh --no-rcs
```

---

## Step 1 — Add your Stripe keys

**Do NOT paste keys in chat. Store them in files only.**

### 1a. Create the master env file

```bash
cp marketplace-os/.env.example marketplace-os/.env
```

Edit `marketplace-os/.env` and fill in:

```env
# ─── STRIPE (global fallback) ──────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
STRIPE_PRICE_SELLER_MONTHLY=price_YOUR_PRICE_ID
STRIPE_PRICE_BUYER_PRO=price_YOUR_PRICE_ID
STRIPE_PRICE_RFQ_BOOST=price_YOUR_PRICE_ID

# ─── FRONTEND (per-app) ────────────────────────────────────────────────────
# Copy this block and save as apps/[app]/frontend/.env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

### 1b. How to get your Stripe keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy "Secret key" → `STRIPE_SECRET_KEY`
3. Copy "Publishable key" → `VITE_STRIPE_PUBLISHABLE_KEY`

### 1c. Create Stripe products (one-time setup, ~5 minutes)

Run this in the Stripe Dashboard → Products → Add product:

| Product | Price | Billing | Env var |
|---------|-------|---------|---------|
| Seller Monthly | $99/mo | Recurring | `STRIPE_PRICE_SELLER_MONTHLY` |
| Buyer Pro | $49/mo | Recurring | `STRIPE_PRICE_BUYER_PRO` |
| RFQ Boost | $19 | One-time | `STRIPE_PRICE_RFQ_BOOST` |

Copy the `price_xxx` IDs into your `.env`.

### 1d. Configure the Stripe webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://your-backend.railway.app/payments/webhook`
   (For local dev: install Stripe CLI → `stripe listen --forward-to localhost:8001/payments/webhook`)
3. Select events: `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy "Signing secret" → `STRIPE_WEBHOOK_SECRET`

---

## Step 2 — Run locally (instant preview, no deploy needed)

### Start the Portfolio Hub (shows all 20 apps)

```bash
cd marketplace-os/apps/hub
npm install
npm run dev
# → http://localhost:3000
```

### Start a single marketplace

```bash
cd marketplace-os/apps/cheemos/frontend
npm install
npm run dev
# → http://localhost:3002
```

### Start all 20 at once

```bash
cd marketplace-os
bash START.sh all
# Opens ports 3000-3020
```

### Start a backend (Python FastAPI)

```bash
cd marketplace-os/apps/mrodirect/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # then add your Stripe key
uvicorn src.main:app --reload --port 8001
# → http://localhost:8001/docs (auto API docs)
```

---

## Step 3 — Push to GitHub

### 3a. Authenticate

```bash
gh auth login
# Choose: GitHub.com → HTTPS → Login with browser
```

### 3b. Create all 20 repos + push (run from marketplace-os/)

```bash
cd marketplace-os

# Initialize git
git init
git add .
git commit -m "feat: initial Marketplace OS — 20 B2B marketplaces"

# Create the monorepo on GitHub
gh repo create Greenmamba29/marketplace-os \
  --public \
  --description "20 B2B vertical marketplaces — \$680M GMV portfolio" \
  --push \
  --source .
```

This creates ONE monorepo with all 20 apps. Netlify will deploy each separately.

---

## Step 4 — Deploy to Netlify (20 live URLs)

### 4a. Login to Netlify

```bash
netlify login
# Opens browser → authorize
```

### 4b. Deploy all 20 frontends with one script

```bash
cd marketplace-os
bash deploy-netlify.sh
```

This script (already in the repo) will:
1. `npm run build` each frontend
2. `netlify deploy --prod --dir=dist --site=...` for each app
3. Print all 20 live URLs at the end

### 4c. OR deploy one at a time

```bash
cd marketplace-os/apps/cheemos/frontend
npm install && npm run build
netlify deploy --prod --dir=dist
# First time: netlify will ask you to create/link a site
```

### 4d. Set env vars on Netlify

For each site in Netlify Dashboard → Site settings → Environment variables:
```
VITE_API_URL=https://your-cheemos-backend.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Step 5 — Deploy backends to Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select `Greenmamba29/marketplace-os`
3. Set root directory to `apps/mrodirect/backend`
4. Add environment variables (copy from your `.env`)
5. Railway auto-detects Python + `requirements.txt` and deploys

Repeat for each backend. Railway free tier handles all 20.

---

## Revenue model — how money flows on day 1

| Event | Amount | Stripe trigger |
|-------|--------|----------------|
| Vendor signs up (Seller plan) | $99/month | `checkout.session.completed` |
| Buyer upgrades to Pro | $49/month | `checkout.session.completed` |
| Order completed (2.5% fee) | varies | `payment_intent.succeeded` |
| RFQ Boost | $19 one-time | `payment_intent.succeeded` |

**You start earning the moment you:**
1. Add `STRIPE_SECRET_KEY` to one backend `.env`
2. Deploy that backend to Railway
3. Send one vendor to `/pricing`

---

## Port reference

| App | Frontend | Backend |
|-----|----------|---------|
| Hub | 3000 | — |
| MRODirect | 3001 | 8001 |
| ChemOS | 3002 | 8002 |
| BuildSource | 3003 | 8003 |
| MedSupplyOS | 3004 | 8004 |
| VoltSource | 3005 | 8005 |
| LithiumBuy | 3006 | 8006 |
| FoodOps | 3007 | 8007 |
| PackSource | 3008 | 8008 |
| AgroOps | 3009 | 8009 |
| LabSource | 3010 | 8010 |
| RigSource | 3011 | 8011 |
| CareOps | 3012 | 8012 |
| GovSource | 3013 | 8013 |
| SurplusOS | 3014 | 8014 |
| NetSource | 3015 | 8015 |
| SecureSource | 3016 | 8016 |
| UniformOS | 3017 | 8017 |
| WorkspaceOS | 3018 | 8018 |
| IngredientOS | 3019 | 8019 |
| BarrelHub | 3020 | 8020 |

---

## Need help?

- Stripe docs: https://stripe.com/docs/checkout/quickstart
- Railway deploy: https://docs.railway.app
- Netlify deploy: https://docs.netlify.com/site-deploys/create-deploys/
- FastAPI docs: https://fastapi.tiangolo.com
