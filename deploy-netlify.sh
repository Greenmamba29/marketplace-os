#!/bin/bash
# deploy-netlify.sh — Deploy all 20 Marketplace OS frontends to Netlify
# Run from the marketplace-os/ root directory
#
# Prerequisites:
#   npm install -g netlify-cli
#   netlify login

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║     MARKETPLACE OS — NETLIFY DEPLOY         ║"
echo "  ║         Deploying 21 sites...               ║"
echo "  ╚══════════════════════════════════════════════╝"
echo -e "${NC}"

if ! command -v netlify &> /dev/null; then
  echo -e "${RED}Netlify CLI not found. Install it:${NC}"
  echo "  npm install -g netlify-cli"
  echo "  netlify login"
  exit 1
fi

LIVE_URLS=()
FAILED=()

deploy_app() {
  local app=$1
  local dir=$2
  local site_name=$3

  echo -e "\n${CYAN}Deploying ${app}...${NC}"

  if [ ! -d "$dir" ] || [ ! -f "$dir/package.json" ]; then
    echo -e "  ${RED}Skipping $app — directory not found${NC}"
    FAILED+=("$app (not found)")
    return
  fi

  # Install
  echo "  Installing dependencies..."
  npm install --prefix "$dir" --silent 2>/dev/null || {
    echo -e "  ${RED}npm install failed for $app${NC}"
    FAILED+=("$app (install failed)")
    return
  }

  # Build
  echo "  Building..."
  npm run build --prefix "$dir" 2>&1 | tail -5 || {
    echo -e "  ${RED}Build failed for $app${NC}"
    FAILED+=("$app (build failed)")
    return
  }

  # Deploy
  echo "  Deploying to Netlify..."
  DEPLOY_OUTPUT=$(netlify deploy \
    --prod \
    --dir "$dir/dist" \
    --site "$site_name" \
    --message "Marketplace OS — $app" \
    2>&1) || {
    # If site doesn't exist yet, create it
    netlify sites:create --name "$site_name" 2>/dev/null || true
    DEPLOY_OUTPUT=$(netlify deploy \
      --prod \
      --dir "$dir/dist" \
      --site "$site_name" \
      --message "Marketplace OS — $app" \
      2>&1)
  }

  URL=$(echo "$DEPLOY_OUTPUT" | grep "Website URL" | awk '{print $NF}')
  if [ -n "$URL" ]; then
    echo -e "  ${GREEN}✓ Live at: $URL${NC}"
    LIVE_URLS+=("$app → $URL")
  else
    echo -e "  ${YELLOW}Deployed (URL not captured — check Netlify dashboard)${NC}"
    LIVE_URLS+=("$app → https://${site_name}.netlify.app")
  fi
}

# Hub
deploy_app "hub" "apps/hub" "marketplace-os-hub"

# Tier 1
deploy_app "mrodirect"   "apps/mrodirect/frontend"   "marketplace-os-mrodirect"
deploy_app "cheemos"     "apps/cheemos/frontend"     "marketplace-os-cheemos"
deploy_app "buildsource" "apps/buildsource/frontend" "marketplace-os-buildsource"
deploy_app "medsupplyos" "apps/medsupplyos/frontend" "marketplace-os-medsupplyos"
deploy_app "voltsource"  "apps/voltsource/frontend"  "marketplace-os-voltsource"
deploy_app "lithiumbuy"  "apps/lithiumbuy/frontend"  "marketplace-os-lithiumbuy"

# Tier 2
deploy_app "foodops"     "apps/foodops/frontend"     "marketplace-os-foodops"
deploy_app "packsource"  "apps/packsource/frontend"  "marketplace-os-packsource"
deploy_app "agroops"     "apps/agroops/frontend"     "marketplace-os-agroops"
deploy_app "labsource"   "apps/labsource/frontend"   "marketplace-os-labsource"
deploy_app "rigsource"   "apps/rigsource/frontend"   "marketplace-os-rigsource"
deploy_app "careops"     "apps/careops/frontend"     "marketplace-os-careops"
deploy_app "govsource"   "apps/govsource/frontend"   "marketplace-os-govsource"
deploy_app "surplusos"   "apps/surplusos/frontend"   "marketplace-os-surplusos"

# Tier 3
deploy_app "netsource"    "apps/netsource/frontend"    "marketplace-os-netsource"
deploy_app "securesource" "apps/securesource/frontend" "marketplace-os-securesource"
deploy_app "uniformos"    "apps/uniformos/frontend"    "marketplace-os-uniformos"
deploy_app "workspaceos"  "apps/workspaceos/frontend"  "marketplace-os-workspaceos"
deploy_app "ingredientos" "apps/ingredientos/frontend" "marketplace-os-ingredientos"
deploy_app "barrelhub"    "apps/barrelhub/frontend"    "marketplace-os-barrelhub"

# Summary
echo ""
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  DEPLOY COMPLETE — ${#LIVE_URLS[@]} sites live${NC}"
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo ""
for url in "${LIVE_URLS[@]}"; do
  echo -e "  ${CYAN}${url}${NC}"
done

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo -e "${RED}Failed (${#FAILED[@]}):${NC}"
  for fail in "${FAILED[@]}"; do
    echo -e "  ${RED}✗ $fail${NC}"
  done
fi

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Add VITE_API_URL + VITE_STRIPE_PUBLISHABLE_KEY to each site's"
echo "     Netlify Dashboard → Site settings → Environment variables"
echo "  2. Redeploy after adding env vars (or use netlify env:set)"
echo "  3. See SETUP.md for backend deployment to Railway"
