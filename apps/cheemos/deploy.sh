#!/usr/bin/env bash
# ChemOS deployment script
# Usage: ./deploy.sh [staging|production]

set -euo pipefail

ENV="${1:-production}"
COMPOSE_FILE="docker-compose.yml"

echo "=== ChemOS Deploy — $ENV ==="

# Ensure .env exists
if [ ! -f .env ]; then
  echo "ERROR: .env not found. Copy .env.example to .env and fill in your credentials."
  exit 1
fi

# Pull latest images
docker compose -f "$COMPOSE_FILE" pull redis || true

# Build app images
echo "Building backend..."
docker compose -f "$COMPOSE_FILE" build backend

echo "Building frontend..."
docker compose -f "$COMPOSE_FILE" build frontend

# Run DB migrations (standalone, before starting app)
echo "Running Alembic migrations against Neon DB..."
docker compose -f "$COMPOSE_FILE" run --rm backend alembic upgrade head

# Start / restart services
echo "Starting services..."
docker compose -f "$COMPOSE_FILE" up -d --force-recreate backend frontend redis celery

# Wait for health check
echo "Waiting for backend health..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:8000/health > /dev/null; then
    echo "Backend healthy."
    break
  fi
  echo "  attempt $i/30..."
  sleep 2
done

docker compose -f "$COMPOSE_FILE" ps
echo "=== Deploy complete ==="
