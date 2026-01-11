#!/bin/bash

# Test API Script
# Usage: ./test-api.sh <token>
# Example: ./test-api.sh "your_jwt_token_here"

BASE_URL="http://localhost:5000"
TOKEN=$1

if [ -z "$TOKEN" ]; then
  echo "Usage: ./test-api.sh <token>"
  echo "Example: ./test-api.sh \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
  exit 1
fi

echo "=== Testing Create Apartment ==="
echo ""
curl -X POST "${BASE_URL}/api/apartments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "A101",
    "apartmentNumber": "101",
    "building": "A",
    "area": 80.5
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' || cat

echo ""
echo "=== Testing Create Fee ==="
echo ""
curl -X POST "${BASE_URL}/api/fees" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "title": "Phí dịch vụ tháng 12/2025",
    "description": "Thu phí dịch vụ chung cư",
    "type": "Service",
    "amount": 5000,
    "unit": "m2"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' || cat

echo ""
echo "Done!"
