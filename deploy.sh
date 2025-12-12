#!/bin/bash

# Deployment script for Laravel + Next.js on Hostinger VPS
# This script builds and serves both applications

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create a .env file from .env.example"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo -e "${YELLOW}📦 Installing/Updating PHP dependencies...${NC}"
composer install --no-dev --optimize-autoloader --no-interaction

echo -e "${YELLOW}📦 Installing/Updating Node dependencies (root)...${NC}"
npm ci

echo -e "${YELLOW}🔨 Building Laravel assets...${NC}"
npm run build

echo -e "${YELLOW}📦 Installing/Updating Node dependencies (frontend)...${NC}"
cd frontend
npm ci

echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
npm run build

cd ..

echo -e "${YELLOW}🔧 Optimizing Laravel...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
php artisan migrate --force

echo -e "${YELLOW}🔗 Creating storage symlink...${NC}"
php artisan storage:link || true

echo -e "${YELLOW}🔐 Setting permissions...${NC}"
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🎉 Your application is ready to serve!${NC}"

# Restart services (adjust based on your setup)
echo -e "${YELLOW}🔄 Restarting services...${NC}"

# For PHP-FPM (common on Hostinger)
if command -v systemctl &> /dev/null; then
    sudo systemctl restart php*-fpm 2>/dev/null || true
fi

# For Nginx
if command -v systemctl &> /dev/null; then
    sudo systemctl reload nginx 2>/dev/null || true
fi

# For PM2 (Next.js frontend)
if command -v pm2 &> /dev/null; then
    # Check if Next.js is running with PM2
    if pm2 list | grep -q "binirman-frontend"; then
        echo -e "${YELLOW}🔄 Restarting Next.js with PM2...${NC}"
        pm2 restart binirman-frontend
    else
        echo -e "${YELLOW}🚀 Starting Next.js with PM2...${NC}"
        cd frontend
        if [ -f ecosystem.config.js ]; then
            pm2 start ecosystem.config.js
        else
            pm2 start npm --name "binirman-frontend" -- start
        fi
        pm2 save
        cd ..
    fi
fi

echo -e "${GREEN}✨ All done!${NC}"

