#!/bin/bash
# deploy-github.sh — Initialize git and push all 20 apps to GitHub
# Run from the marketplace-os/ root directory
#
# Prerequisites:
#   gh auth login

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GITHUB_USER="Greenmamba29"
REPO_NAME="marketplace-os"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}Setting up GitHub repo: ${GITHUB_USER}/${REPO_NAME}${NC}"

# Confirm gh is authenticated
if ! gh auth status &>/dev/null; then
  echo "GitHub CLI not authenticated. Run: gh auth login"
  exit 1
fi

# Create .gitignore if missing
if [ ! -f .gitignore ]; then
cat > .gitignore << 'GITIGNORE'
node_modules/
dist/
.env
.env.local
.env.*.local
__pycache__/
*.pyc
.venv/
*.egg-info/
.DS_Store
*.log
GITIGNORE
fi

# Init git
if [ ! -d .git ]; then
  git init
  echo -e "${GREEN}Git initialized${NC}"
fi

# Stage all files
git add .

# Commit
git commit -m "feat: Marketplace OS — 20 B2B vertical marketplaces

Portfolio of 20 vertical-specific B2B managed marketplaces:
- 20 React+TypeScript+Vite frontends
- 20 FastAPI Python backends  
- Stripe payment integration (plug-and-play)
- Portfolio Hub at port 3000
- Infrastructure: Docker Compose, Nginx, CI/CD

GMV Portfolio: \$680M (Year 3)
Revenue: \$111M (Year 3)" 2>/dev/null || echo "Nothing new to commit"

# Create GitHub repo (public — change to --private if needed)
echo -e "${CYAN}Creating GitHub repo...${NC}"
gh repo create "${GITHUB_USER}/${REPO_NAME}" \
  --public \
  --description "20 B2B vertical marketplaces — \$680M GMV portfolio. React + FastAPI + Stripe." \
  --homepage "https://marketplace-os-hub.netlify.app" \
  2>/dev/null || echo "Repo may already exist — continuing..."

# Set remote and push
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
git branch -M main
git push -u origin main

echo ""
echo -e "${GREEN}✓ Code pushed to: https://github.com/${GITHUB_USER}/${REPO_NAME}${NC}"
echo ""
echo -e "${YELLOW}Next: Run ./deploy-netlify.sh to go live${NC}"
