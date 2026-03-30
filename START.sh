#!/bin/bash
# Marketplace OS - Quick Start Script
# Installs deps and starts the Hub (port 3000) + optionally all 20 marketplaces

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║        MARKETPLACE OS - QUICK START          ║"
echo "  ║    20 B2B Vertical Marketplaces Portfolio    ║"
echo "  ╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# Check Node
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Install Node.js 20+ from https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Node.js 18+ required. Current: $(node --version)"
  exit 1
fi

echo -e "${GREEN}Node.js $(node --version) detected${NC}"
echo ""

# Parse args
MODE=${1:-"hub"}

install_app() {
  local app=$1
  local dir=$2
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    if [ ! -d "$dir/node_modules" ]; then
      echo -e "  Installing ${CYAN}$app${NC}..."
      npm install --prefix "$dir" --silent 2>/dev/null || npm install --prefix "$dir" 2>&1 | tail -3
    else
      echo -e "  ${GREEN}$app${NC} already installed"
    fi
  fi
}

start_app() {
  local app=$1
  local dir=$2
  local port=$3
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    echo -e "  Starting ${CYAN}$app${NC} on port ${YELLOW}$port${NC}..."
    npm run dev --prefix "$dir" > "/tmp/marketplace-os-$app.log" 2>&1 &
    echo $! >> /tmp/marketplace-os-pids.txt
  fi
}

# Hub only mode (fastest start)
if [ "$MODE" == "hub" ]; then
  echo "Mode: HUB ONLY (runs the portfolio dashboard at http://localhost:3000)"
  echo "Use './START.sh all' to start all 20 marketplaces"
  echo ""
  
  echo "Installing Hub..."
  install_app "hub" "apps/hub"
  
  echo ""
  echo "Starting Hub..."
  cd apps/hub
  echo -e "${GREEN}Opening http://localhost:3000${NC}"
  npm run dev

elif [ "$MODE" == "all" ]; then
  echo "Mode: ALL 20 MARKETPLACES"
  echo ""
  
  rm -f /tmp/marketplace-os-pids.txt
  
  declare -A APP_DIRS=(
    ["hub"]="apps/hub"
    ["mrodirect"]="apps/mrodirect/frontend"
    ["cheemos"]="apps/cheemos/frontend"
    ["buildsource"]="apps/buildsource/frontend"
    ["medsupplyos"]="apps/medsupplyos/frontend"
    ["voltsource"]="apps/voltsource/frontend"
    ["lithiumbuy"]="apps/lithiumbuy/frontend"
    ["foodops"]="apps/foodops/frontend"
    ["packsource"]="apps/packsource/frontend"
    ["agroops"]="apps/agroops/frontend"
    ["labsource"]="apps/labsource/frontend"
    ["rigsource"]="apps/rigsource/frontend"
    ["careops"]="apps/careops/frontend"
    ["govsource"]="apps/govsource/frontend"
    ["surplusos"]="apps/surplusos/frontend"
    ["netsource"]="apps/netsource/frontend"
    ["securesource"]="apps/securesource/frontend"
    ["uniformos"]="apps/uniformos/frontend"
    ["workspaceos"]="apps/workspaceos/frontend"
    ["ingredientos"]="apps/ingredientos/frontend"
    ["barrelhub"]="apps/barrelhub/frontend"
  )

  declare -A APP_PORTS=(
    ["hub"]="3000" ["mrodirect"]="3001" ["cheemos"]="3002" ["buildsource"]="3003"
    ["medsupplyos"]="3004" ["voltsource"]="3005" ["lithiumbuy"]="3006" ["foodops"]="3007"
    ["packsource"]="3008" ["agroops"]="3009" ["labsource"]="3010" ["rigsource"]="3011"
    ["careops"]="3012" ["govsource"]="3013" ["surplusos"]="3014" ["netsource"]="3015"
    ["securesource"]="3016" ["uniformos"]="3017" ["workspaceos"]="3018"
    ["ingredientos"]="3019" ["barrelhub"]="3020"
  )

  echo "=== Installing dependencies ==="
  for app in hub mrodirect cheemos buildsource medsupplyos voltsource lithiumbuy foodops packsource agroops labsource rigsource careops govsource surplusos netsource securesource uniformos workspaceos ingredientos barrelhub; do
    install_app "$app" "${APP_DIRS[$app]}"
  done

  echo ""
  echo "=== Starting all frontends ==="
  for app in hub mrodirect cheemos buildsource medsupplyos voltsource lithiumbuy foodops packsource agroops labsource rigsource careops govsource surplusos netsource securesource uniformos workspaceos ingredientos barrelhub; do
    start_app "$app" "${APP_DIRS[$app]}" "${APP_PORTS[$app]}"
    sleep 0.5
  done

  echo ""
  echo -e "${GREEN}All 21 servers starting...${NC}"
  echo ""
  echo "=== ACCESS URLS ==="
  echo -e "  ${CYAN}Portfolio Hub:${NC}    http://localhost:3000"
  echo -e "  ${CYAN}MRODirect:${NC}        http://localhost:3001"
  echo -e "  ${CYAN}ChemOS:${NC}           http://localhost:3002"
  echo -e "  ${CYAN}BuildSource:${NC}      http://localhost:3003"
  echo -e "  ${CYAN}MedSupplyOS:${NC}      http://localhost:3004"
  echo -e "  ${CYAN}VoltSource:${NC}       http://localhost:3005"
  echo -e "  ${CYAN}LithiumBuy:${NC}       http://localhost:3006"
  echo -e "  ${CYAN}FoodOps:${NC}          http://localhost:3007"
  echo -e "  ${CYAN}PackSource:${NC}       http://localhost:3008"
  echo -e "  ${CYAN}AgroOps:${NC}          http://localhost:3009"
  echo -e "  ${CYAN}LabSource:${NC}        http://localhost:3010"
  echo -e "  ${CYAN}RigSource:${NC}        http://localhost:3011"
  echo -e "  ${CYAN}CareOps:${NC}          http://localhost:3012"
  echo -e "  ${CYAN}GovSource:${NC}        http://localhost:3013"
  echo -e "  ${CYAN}SurplusOS:${NC}        http://localhost:3014"
  echo -e "  ${CYAN}NetSource:${NC}        http://localhost:3015"
  echo -e "  ${CYAN}SecureSource:${NC}     http://localhost:3016"
  echo -e "  ${CYAN}UniformOS:${NC}        http://localhost:3017"
  echo -e "  ${CYAN}WorkspaceOS:${NC}      http://localhost:3018"
  echo -e "  ${CYAN}IngredientOS:${NC}     http://localhost:3019"
  echo -e "  ${CYAN}BarrelHub:${NC}        http://localhost:3020"
  echo ""
  echo "Press Ctrl+C to stop all servers"
  trap 'kill $(cat /tmp/marketplace-os-pids.txt 2>/dev/null) 2>/dev/null; exit' INT
  wait

else
  # Single app mode: ./START.sh cheemos
  APP=$MODE
  if [ -d "apps/$APP/frontend" ]; then
    DIR="apps/$APP/frontend"
  elif [ -d "apps/$APP" ]; then
    DIR="apps/$APP"
  else
    echo "App '$APP' not found"
    exit 1
  fi
  
  install_app "$APP" "$DIR"
  echo "Starting $APP..."
  cd "$DIR"
  npm run dev
fi
