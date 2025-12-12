# Quick Start Deployment Guide

This is a condensed guide to get you up and running quickly. For detailed information, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🚀 Quick Setup (5 Steps)

### 1. Initial VPS Setup

SSH into your VPS and run:

```bash
# Download and run setup script
curl -o setup-vps.sh https://raw.githubusercontent.com/your-username/your-repo/main/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

Or manually install:
- PHP 8.2+ with extensions
- Composer
- Node.js 20+
- PM2
- Nginx
- Git

### 2. Clone Repository

```bash
cd /var/www
git clone https://github.com/your-username/your-repo.git binirman
cd binirman
```

### 3. Configure Environment

```bash
# Laravel
cp .env.example .env
nano .env  # Edit with your settings

# Generate key
php artisan key:generate

# Next.js
cd frontend
nano .env.local  # Add NEXT_PUBLIC_API_URL=https://yourdomain.com/api
cd ..
```

**Required .env variables:**
```env
APP_URL=https://yourdomain.com
CENTRAL_DOMAINS=yourdomain.com,www.yourdomain.com
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

### 4. First Deployment

```bash
chmod +x deploy.sh
./deploy.sh
```

### 5. Configure Nginx & SSL

```bash
# Copy Nginx config
sudo cp nginx.conf.example /etc/nginx/sites-available/binirman
sudo nano /etc/nginx/sites-available/binirman  # Update domain names

# Enable site
sudo ln -s /etc/nginx/sites-available/binirman /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🔄 Automatic Deployment Setup

### GitHub Actions

1. **Generate SSH key on VPS:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
   cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
   cat ~/.ssh/github_actions  # Copy this for GitHub secret
   ```

2. **Add GitHub Secrets:**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add:
     - `VPS_SSH_PRIVATE_KEY`: Content of `~/.ssh/github_actions`
     - `VPS_HOST`: Your VPS IP or domain
     - `VPS_USER`: SSH username
     - `VPS_DEPLOY_PATH`: `/var/www/binirman`

3. **Test:**
   - Push to `main` branch or manually trigger workflow

## 📋 Manual Deployment

```bash
cd /var/www/binirman
git pull origin main
./deploy.sh
```

## 🔧 Common Commands

```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Check Next.js logs (PM2)
pm2 logs binirman-frontend

# Restart services
sudo systemctl restart php8.2-fpm
sudo systemctl reload nginx
pm2 restart binirman-frontend

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## ⚠️ Troubleshooting

**Permission errors:**
```bash
sudo chown -R www-data:www-data /var/www/binirman
sudo chmod -R 755 /var/www/binirman
sudo chmod -R 775 storage bootstrap/cache
```

**Next.js not starting:**
```bash
cd /var/www/binirman/frontend
pm2 start ecosystem.config.js
pm2 save
```

**Database connection issues:**
- Check `.env` database credentials
- Ensure MySQL user has proper permissions
- Test: `php artisan migrate:status`

## 📚 More Information

- Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Environment variables: [ENV_VARIABLES.md](./ENV_VARIABLES.md)

