# Environment Variables Reference

This document lists all environment variables needed for the application.

## Laravel Backend (.env)

### Application
```env
APP_NAME="Binirman"
APP_ENV=production
APP_KEY=base64:your-generated-key-here
APP_DEBUG=false
APP_URL=https://yourdomain.com
APP_TIMEZONE=UTC
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
```

### Database
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

### Tenancy (Multi-tenant)
```env
# Comma-separated list of central domains
CENTRAL_DOMAINS=yourdomain.com,www.yourdomain.com,admin.yourdomain.com
```

### Session & Cache
```env
SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

### Mail (if using email features)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### Filesystem
```env
FILESYSTEM_DISK=local
```

## Next.js Frontend (.env.local or .env.production)

### API Configuration
```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Environment
NODE_ENV=production
```

## Setting Up Environment Variables

### On VPS

1. **Laravel .env**:
   ```bash
   cd /var/www/binirman
   cp .env.example .env
   nano .env
   ```

2. **Generate Laravel Key**:
   ```bash
   php artisan key:generate
   ```

3. **Next.js .env.local**:
   ```bash
   cd /var/www/binirman/frontend
   nano .env.local
   ```

### Important Notes

- Never commit `.env` or `.env.local` files to Git
- Use strong passwords in production
- Set `APP_DEBUG=false` in production
- Update `APP_URL` and `CENTRAL_DOMAINS` with your actual domain
- Ensure `NEXT_PUBLIC_API_URL` matches your Laravel API URL

