#!/usr/bin/env bash
# Run Alembic migrations directly against Neon DB
# Usage: ./migrate.sh [head|<revision>]

set -euo pipefail

REVISION="${1:-head}"

if [ ! -f .env ]; then
  echo "ERROR: .env not found"
  exit 1
fi

# Source env vars
set -a && source .env && set +a

echo "Running Alembic migration to: $REVISION"
cd backend
DATABASE_URL="${NEON_DATABASE_URL:-$DATABASE_URL}" alembic upgrade "$REVISION"
echo "Migration complete."
