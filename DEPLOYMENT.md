# Deployment Guide for Hostinger VPS

This guide will help you set up automatic deployment for your Laravel + Next.js application on Hostinger VPS.

## Prerequisites

1. A Hostinger VPS with:
   - PHP 8.2+ installed
   - Composer installed
   - Node.js 18+ and npm installed
   - Git installed
   - Nginx or Apache web server
   - SSH access

2. A GitHub repository with your code

## Initial VPS Setup

### 1. Connect to Your VPS

```bash
ssh your-user@your-vps-ip
```

### 2. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install prerequisites for adding repositories
sudo apt install -y software-properties-common apt-transport-https lsb-release ca-certificates

# Add PHP repository (ondrej/php PPA) for PHP 8.2
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP and extensions
sudo apt install -y php8.2-fpm php8.2-cli php8.2-mysql php8.2-xml php8.2-mbstring \
    php8.2-curl php8.2-zip php8.2-gd php8.2-bcmath php8.2-intl

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install git -y

# Install Nginx (if not already installed)
sudo apt install nginx -y
```

### 3. Clone Your Repository

```bash
cd /var/www  # or your preferred directory
git clone https://github.com/your-username/your-repo.git binirman
cd binirman
```

### 4. Set Up Environment Files

```bash
# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env.local  # if you have one

# Edit .env file
nano .env
```

Update these important variables in `.env`:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Central domains for tenancy (comma-separated)
CENTRAL_DOMAINS=yourdomain.com,www.yourdomain.com

# Next.js API URL
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Set Up Database

```bash
# Run migrations
php artisan migrate --force

# If you have seeders
php artisan db:seed --force
```

### 7. Set Permissions

```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 755 storage bootstrap/cache
```

### 8. Make Deployment Script Executable

```bash
chmod +x deploy.sh
```

## Nginx Configuration

Create an Nginx configuration file for your application:

```bash
sudo nano /etc/nginx/sites-available/binirman
```

Add the following configuration:

```nginx
# Laravel Backend (API)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/binirman/public;
    index index.php;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}

# Next.js Frontend (if running on separate port)
# Or use reverse proxy to Next.js
server {
    listen 3000;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/binirman /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Running Next.js in Production

You have several options:

### Option 1: PM2 (Recommended)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start Next.js with PM2
cd /var/www/binirman/frontend
pm2 start npm --name "binirman-frontend" -- start
pm2 save
pm2 startup
```

### Option 2: Systemd Service

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/binirman-frontend.service
```

```ini
[Unit]
Description=Binirman Next.js Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/binirman/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable binirman-frontend
sudo systemctl start binirman-frontend
```

## GitHub Actions Setup

### 1. Generate SSH Key on VPS

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
```

### 2. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

- `VPS_SSH_PRIVATE_KEY`: The private key content (`~/.ssh/github_actions`)
- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USER`: Your SSH username
- `VPS_DEPLOY_PATH`: Full path to your project (e.g., `/var/www/binirman`)

### 3. Test Deployment

Push to your main branch or manually trigger the workflow from GitHub Actions tab.

## Manual Deployment

If you want to deploy manually:

```bash
cd /var/www/binirman
git pull origin main
./deploy.sh
```

## Troubleshooting

### Permission Issues

```bash
sudo chown -R www-data:www-data /var/www/binirman
sudo chmod -R 755 /var/www/binirman
sudo chmod -R 775 /var/www/binirman/storage
sudo chmod -R 775 /var/www/binirman/bootstrap/cache
```

### Check Logs

```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# PHP-FPM logs
sudo tail -f /var/log/php8.2-fpm.log

# Next.js logs (if using PM2)
pm2 logs binirman-frontend
```

### Clear Caches

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## Domain Configuration

Make sure to update:

1. **Laravel `.env`**:
   - `APP_URL=https://yourdomain.com`
   - `CENTRAL_DOMAINS=yourdomain.com,www.yourdomain.com`

2. **Next.js `.env.local`**:
   - `NEXT_PUBLIC_API_URL=https://yourdomain.com/api`

3. **Nginx configuration**: Update `server_name` directives

4. **DNS**: Point your domain to your VPS IP address

## Security Checklist

- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong database passwords
- [ ] Enable SSL/HTTPS
- [ ] Set up firewall (UFW)
- [ ] Keep software updated
- [ ] Use environment variables for secrets
- [ ] Set proper file permissions
- [ ] Enable rate limiting in Nginx

## Maintenance

### Regular Updates

```bash
# Update Composer packages
composer update --no-dev --optimize-autoloader

# Update npm packages
npm update
cd frontend && npm update

# Update system packages
sudo apt update && sudo apt upgrade -y
```

### Backup

Set up regular backups for:
- Database
- Storage files
- Environment files

Consider using a cron job or automated backup service.

