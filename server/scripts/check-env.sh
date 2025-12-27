#!/bin/bash

# Environment Configuration Validation Script
# This script checks if your environment is properly configured

set -e

echo "🔍 Checking environment configuration..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
else
    echo -e "${RED}✗${NC} .env file not found"
    echo -e "${YELLOW}→${NC} Run: cp .env.example .env"
    exit 1
fi

# Check if .env.example exists
if [ -f .env.example ]; then
    echo -e "${GREEN}✓${NC} .env.example file exists"
else
    echo -e "${YELLOW}⚠${NC} .env.example file not found"
fi

# Check if .env.production exists
if [ -f .env.production ]; then
    echo -e "${GREEN}✓${NC} .env.production file exists"
else
    echo -e "${YELLOW}⚠${NC} .env.production file not found (needed for production)"
fi

# Check if .env.test exists
if [ -f .env.test ]; then
    echo -e "${GREEN}✓${NC} .env.test file exists"
else
    echo -e "${YELLOW}⚠${NC} .env.test file not found (needed for testing)"
fi

echo ""
echo "🔐 Checking required environment variables..."
echo ""

# Load .env file
export $(cat .env | grep -v '^#' | xargs)

# Check DATABASE_URL
if [ -n "$DATABASE_URL" ]; then
    echo -e "${GREEN}✓${NC} DATABASE_URL is set"
else
    echo -e "${RED}✗${NC} DATABASE_URL is not set"
fi

# Check JWT_SECRET
if [ -n "$JWT_SECRET" ]; then
    echo -e "${GREEN}✓${NC} JWT_SECRET is set"
    
    # Check if it's still the default value
    if [ "$JWT_SECRET" = "your-secret-key-change-this-in-production" ]; then
        echo -e "${YELLOW}  ⚠ WARNING: Using default JWT_SECRET${NC}"
        echo -e "  ${YELLOW}→ Generate a new secret: openssl rand -base64 32${NC}"
    fi
else
    echo -e "${RED}✗${NC} JWT_SECRET is not set"
fi

# Check NODE_ENV
if [ -n "$NODE_ENV" ]; then
    echo -e "${GREEN}✓${NC} NODE_ENV is set to: $NODE_ENV"
else
    echo -e "${YELLOW}⚠${NC} NODE_ENV not set (will default to 'development')"
fi

# Check PORT
if [ -n "$PORT" ]; then
    echo -e "${GREEN}✓${NC} PORT is set to: $PORT"
else
    echo -e "${YELLOW}⚠${NC} PORT not set (will default to 3000)"
fi

echo ""
echo "📦 Optional configurations..."
echo ""

# Check AI Service
if [ -n "$GEMINI_API_KEY" ] || [ -n "$OPENAI_API_KEY" ] || [ -n "$ANTHROPIC_API_KEY" ]; then
    echo -e "${GREEN}✓${NC} At least one AI service API key is configured"
else
    echo -e "${YELLOW}⚠${NC} No AI service API keys configured"
fi

# Check Redis
if [ -n "$REDIS_HOST" ]; then
    echo -e "${GREEN}✓${NC} Redis configuration found"
else
    echo -e "${YELLOW}⚠${NC} Redis not configured (needed for queues)"
fi

# Check Email
if [ -n "$MAIL_HOST" ] && [ -n "$MAIL_USER" ]; then
    echo -e "${GREEN}✓${NC} Email configuration found"
else
    echo -e "${YELLOW}⚠${NC} Email not configured (needed for notifications)"
fi

echo ""
echo "✅ Environment check complete!"
echo ""
