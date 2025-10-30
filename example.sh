#!/bin/bash

# Example script demonstrating the NestJS API Starter

BASE_URL="http://localhost:3000"

echo "==================================="
echo "NestJS API Starter - Example Usage"
echo "==================================="
echo ""

# Create items
echo "1. Creating items..."
ITEM1=$(curl -s -X POST $BASE_URL/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "description": "Dell XPS 15"}')
ITEM1_ID=$(echo $ITEM1 | jq -r '.id')
echo "Created item: $ITEM1_ID"

ITEM2=$(curl -s -X POST $BASE_URL/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse", "description": "Logitech MX Master"}')
ITEM2_ID=$(echo $ITEM2 | jq -r '.id')
echo "Created item: $ITEM2_ID"

ITEM3=$(curl -s -X POST $BASE_URL/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Keyboard", "description": "Mechanical keyboard"}')
ITEM3_ID=$(echo $ITEM3 | jq -r '.id')
echo "Created item: $ITEM3_ID"
echo ""

# Get all items
echo "2. Getting all items..."
curl -s $BASE_URL/items | jq
echo ""

# Get a specific item
echo "3. Getting item $ITEM1_ID..."
curl -s $BASE_URL/items/$ITEM1_ID | jq
echo ""

# Update an item
echo "4. Updating item $ITEM2_ID..."
curl -s -X PUT $BASE_URL/items/$ITEM2_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "Wireless Mouse", "description": "Logitech MX Master 3"}' | jq
echo ""

# Delete an item
echo "5. Deleting item $ITEM3_ID..."
curl -s -X DELETE $BASE_URL/items/$ITEM3_ID -w "\nHTTP Status: %{http_code}\n"
echo ""

# Get all items again
echo "6. Getting all items after deletion..."
curl -s $BASE_URL/items | jq
echo ""

# Try debug endpoints
echo "7. Testing debug endpoints (development mode only)..."
curl -s $BASE_URL/debug/pprof | jq
echo ""

echo "8. Getting heap statistics..."
curl -s $BASE_URL/debug/pprof/heap | jq
echo ""

echo "==================================="
echo "Example completed!"
echo "Visit http://localhost:3000/swagger for interactive API documentation"
echo "==================================="
