# BarrelHub Frontend

React + TypeScript + Vite frontend for the BarrelHub B2B marketplace for bulk whiskey and spirits.

## Features

- **Landing Page**: Hero section, value props, stats, testimonials
- **Barrel Directory**: Search and filter barrels by age, proof, spirit type
- **Barrel Registry**: Individual barrel tracking with complete history
- **Sensory Profiles**: Professional tasting notes and scoring
- **Market Comps**: Real-time pricing data and trends
- **RFQ Wizard**: Multi-step request for quote workflow
- **Admin Dashboard**: User management and platform analytics

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Or use yarn
yarn install
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Type Checking

```bash
# Run TypeScript compiler
npm run typecheck
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── StatCard.tsx
│   │   └── FilterPanel.tsx
│   ├── pages/               # Page components
│   │   ├── Landing.tsx
│   │   ├── BarrelDirectory.tsx
│   │   ├── BarrelRegistry.tsx
│   │   ├── SensoryProfiles.tsx
│   │   ├── MarketComps.tsx
│   │   ├── RFQWizard.tsx
│   │   └── AdminDashboard.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useBarrels.ts
│   ├── services/            # API services
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── main.tsx             # Entry point
│   ├── App.tsx              # Main app component
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | App name | `BarrelHub` |

## Design System

### Colors

- **Primary**: Amber (`#92400E` - bourbon amber)
- **Background**: Charcoal (`#0F0F0F`)
- **Surface**: Dark gray (`#1A1A1A`)
- **Text**: Light gray (`#F3F4F6`)
- **Muted**: Gray (`#9CA3AF`)

### Typography

- **Display**: Syne (headings)
- **Body**: DM Sans (content)
- **Mono**: JetBrains Mono (data)

### Components

#### Buttons

```tsx
// Primary
<button className="btn-primary">Action</button>

// Secondary
<button className="btn-secondary">Secondary</button>

// Ghost
<button className="btn-ghost">Ghost</button>
```

#### Cards

```tsx
// Standard card
<div className="card">Content</div>

// Elevated card
<div className="card-elevated">Content</div>
```

#### Badges

```tsx
<span className="badge-amber">Amber</span>
<span className="badge-green">Green</span>
<span className="badge-blue">Blue</span>
<span className="badge-gray">Gray</span>
```

## API Integration

The frontend uses TanStack Query for data fetching with a centralized API service:

```tsx
import { useBarrels, useBarrel } from '@/hooks/useBarrels'

// List barrels
const { data, isLoading } = useBarrels(filters, page)

// Get single barrel
const { data: barrel } = useBarrel(id)
```

## Routing

Routes are defined in `App.tsx`:

- `/` - Landing page
- `/barrels` - Barrel directory
- `/registry` - Barrel registry
- `/sensory` - Sensory profiles
- `/market-comps` - Market comps
- `/rfq` - RFQ wizard
- `/admin` - Admin dashboard

## License

MIT License - See LICENSE file for details
