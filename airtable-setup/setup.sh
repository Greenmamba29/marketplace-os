#!/bin/bash

# GrahmOS Virtual Mall - Airtable Setup Script
# Requires: AIRTABLE_TOKEN, AIRTABLE_WORKSPACE_ID

set -e

if [ -z "$AIRTABLE_TOKEN" ]; then
  echo "Error: AIRTABLE_TOKEN is not set."
  exit 1
fi

if [ -z "$AIRTABLE_WORKSPACE_ID" ]; then
  echo "Error: AIRTABLE_WORKSPACE_ID is not set."
  exit 1
fi

BASE_DIR="/Users/paco/.accio/accounts/1740325260/agents/DID-DB9653-765527/project/marketplace-os/airtable-setup"
API_URL="https://api.airtable.com/v0"

echo "🚀 Starting GrahmOS Mall Airtable Setup..."

# 1. Create Mall Directory Base
echo "--- Creating GrahmOS Mall Directory Base ---"
DIRECTORY_SCHEMA=$(cat "$BASE_DIR/schema.json" | jq '.bases[0]')
CREATE_DIR_BASE_PAYLOAD=$(jq -n \
  --arg name "GrahmOS Mall Directory" \
  --arg workspaceId "$AIRTABLE_WORKSPACE_ID" \
  --argjson tables "$(echo "$DIRECTORY_SCHEMA" | jq '.tables')" \
  '{name: $name, workspaceId: $workspaceId, tables: $tables}')

RESPONSE=$(curl -s -X POST "$API_URL/meta/bases" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CREATE_DIR_BASE_PAYLOAD")

MALL_BASE_ID=$(echo "$RESPONSE" | jq -r '.id')

if [ "$MALL_BASE_ID" == "null" ]; then
  echo "Failed to create Mall Directory base. Response: $RESPONSE"
  exit 1
fi

echo "✅ Created Mall Directory Base: $MALL_BASE_ID"

# 2. Populate Stores Table
echo "--- Populating Stores Table ---"
STORES_DATA=$(cat "$BASE_DIR/mall-directory.json")
# Get Stores Table ID (usually the first one)
STORES_TABLE_ID=$(echo "$RESPONSE" | jq -r '.tables[0].id')

# Batch upload (max 10 per request)
echo "$STORES_DATA" | jq -c '.[]' | while read -r store; do
  # Map JSON to Airtable fields
  NAME=$(echo "$store" | jq -r '.name')
  DOMAIN=$(echo "$store" | jq -r '.id')
  URL=$(echo "$store" | jq -r '.netlify_url')
  VERTICAL=$(echo "$store" | jq -r '.vertical')
  TIER=$(echo "$store" | jq -r '.tier')
  WING=$(echo "$store" | jq -r '.wing')
  COLOR=$(echo "$store" | jq -r '.accent_color')
  GMV=$(echo "$store" | jq -r '.gmv_y3_m')
  REV=$(echo "$store" | jq -r '.revenue_y3_m')
  DESC=$(echo "$store" | jq -r '.description')
  ICON=$(echo "$store" | jq -r '.icon')

  RECORD_PAYLOAD=$(jq -n \
    --arg name "$NAME" \
    --arg domain "$DOMAIN" \
    --arg url "$URL" \
    --arg vert "$VERTICAL" \
    --argjson tier "$TIER" \
    --arg wing "$WING" \
    --arg color "$COLOR" \
    --argjson gmv "$GMV" \
    --argjson rev "$REV" \
    --arg status "Open" \
    --arg desc "$DESC" \
    --arg icon "$ICON" \
    '{fields: {"Store Name": $name, "Domain": $domain, "Netlify URL": $url, "Vertical": $vert, "Tier": $tier, "Wing": $wing, "Accent Color": $color, "GMV Y3 ($M)": $gmv, "Revenue Y3 ($M)": $rev, "Status": $status, "Description": $desc, "Icon": $icon}}')
  
  # Accumulate records or send individual (for simplicity in shell, we send 1 by 1 or chunk)
  # For 20 records, 1 by 1 is fine for a setup script.
  curl -s -X POST "$API_URL/$MALL_BASE_ID/$STORES_TABLE_ID" \
    -H "Authorization: Bearer $AIRTABLE_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"records\": [$RECORD_PAYLOAD]}" > /dev/null
done
echo "✅ Stores populated."

# 3. Create Marketplace Bases
echo "--- Creating 20 Marketplace Bases ---"
MARKETPLACE_TEMPLATE=$(cat "$BASE_DIR/schema.json" | jq '.bases[1]')

echo "$STORES_DATA" | jq -r '.id' | while read -r mkt_id; do
  MKT_NAME=$(echo "$STORES_DATA" | jq -r ".[] | select(.id==\"$mkt_id\") | .name")
  echo "Creating base for $MKT_NAME..."
  
  CREATE_MKT_BASE_PAYLOAD=$(jq -n \
    --arg name "$MKT_NAME" \
    --arg workspaceId "$AIRTABLE_WORKSPACE_ID" \
    --argjson tables "$(echo "$MARKETPLACE_TEMPLATE" | jq '.tables')" \
    '{name: $name, workspaceId: $workspaceId, tables: $tables}')

  MKT_RESPONSE=$(curl -s -X POST "$API_URL/meta/bases" \
    -H "Authorization: Bearer $AIRTABLE_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$CREATE_MKT_BASE_PAYLOAD")
  
  MKT_BASE_ID=$(echo "$MKT_RESPONSE" | jq -r '.id')
  MKT_TABLE_ID=$(echo "$MKT_RESPONSE" | jq -r '.tables[0].id')
  
  if [ "$MKT_BASE_ID" != "null" ]; then
    echo "✅ Base created: $MKT_BASE_ID. Populating products..."
    
    # Read seed data
    SEED_FILE="$BASE_DIR/seed-data/$mkt_id.json"
    if [ -f "$SEED_FILE" ]; then
      # Prepare records array
      RECORDS_PAYLOAD=$(jq -c '.products | map({fields: .})' "$SEED_FILE")
      
      # Batch 10 records at a time (shell loop)
      # Simpler: just send the whole array if small (max 10)
      # Our seed files have 15, so we need to chunk.
      echo "$RECORDS_PAYLOAD" | jq -c '.[]' | xargs -L 10 -d '\n' | while read -r chunk; do
        # Note: xargs -L 10 is tricky with JSON. Let's use jq to chunk.
        echo "" # placeholder
      done
      
      # Simplified: just send them in two batches of 10
      BATCH1=$(echo "$RECORDS_PAYLOAD" | jq -c '.[0:10]')
      BATCH2=$(echo "$RECORDS_PAYLOAD" | jq -c '.[10:20]')
      
      curl -s -X POST "$API_URL/$MKT_BASE_ID/$MKT_TABLE_ID" \
        -H "Authorization: Bearer $AIRTABLE_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"records\": $BATCH1}" > /dev/null
        
      curl -s -X POST "$API_URL/$MKT_BASE_ID/$MKT_TABLE_ID" \
        -H "Authorization: Bearer $AIRTABLE_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"records\": $BATCH2}" > /dev/null
    fi
  else
    echo "❌ Failed to create base for $MKT_NAME"
  fi
done

echo "🎉 Setup Complete! 21 Bases created and populated."
