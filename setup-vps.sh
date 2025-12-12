#!/bin/bash

# Initial VPS Setup Script for Binirman
# Run this once on your VPS to set up the environment

set -e

echo "🔧 Setting up VPS for Binirman deployment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}❌ Please do not run this script as root${NC}"
   exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install required packages for adding repositories
echo -e "${YELLOW}📦 Installing prerequisites...${NC}"
sudo apt install -y software-properties-common apt-transport-https lsb-release ca-certificates

# Add PHP repository (ondrej/php PPA)
echo -e "${YELLOW}📦 Adding PHP repository...${NC}"
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP and extensions
echo -e "${YELLOW}📦 Installing PHP 8.2 and extensions...${NC}"
sudo apt install -y php8.2-fpm php8.2-cli php8.2-mysql php8.2-xml php8.2-mbstring \
    php8.2-curl php8.2-zip php8.2-gd php8.2-bcmath php8.2-intl

# Install Composer
if ! command -v composer &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Composer...${NC}"
    cd ~
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    sudo chmod +x /usr/local/bin/composer
fi

# Install Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Install Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Git...${NC}"
    sudo apt install -y git
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Nginx...${NC}"
    sudo apt install -y nginx
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Certbot...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
fi

# Generate SSH key for GitHub Actions
if [ ! -f ~/.ssh/github_actions ]; then
    echo -e "${YELLOW}🔑 Generating SSH key for GitHub Actions...${NC}"
    ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
    cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
    echo -e "${GREEN}✅ SSH key generated!${NC}"
    echo -e "${YELLOW}📋 Add this private key to GitHub Secrets (VPS_SSH_PRIVATE_KEY):${NC}"
    echo ""
    cat ~/.ssh/github_actions
    echo ""
fi

# Create logs directory for PM2
mkdir -p ~/logs

echo -e "${GREEN}✅ VPS setup completed!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Clone your repository: git clone <your-repo-url> /var/www/binirman"
echo "2. Set up your .env file"
echo "3. Configure Nginx using nginx.conf.example"
echo "4. Set up SSL: sudo certbot --nginx -d yourdomain.com"
echo "5. Add GitHub Secrets as mentioned in DEPLOYMENT.md"

