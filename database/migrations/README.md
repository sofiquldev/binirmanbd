# Database Migrations Organization

This directory contains all database migrations for the Binirman BD platform, organized chronologically and by feature.

## Migration Structure

### Core System Migrations
- `0001_01_01_000000_create_users_table.php` - User authentication
- `0001_01_01_000001_create_cache_table.php` - Cache system
- `0001_01_01_000002_create_jobs_table.php` - Queue jobs
- `2019_09_15_000010_create_tenants_table.php` - Multi-tenancy support
- `2019_09_15_000020_create_domains_table.php` - Domain mapping for tenants
- `2025_11_18_102549_create_permission_tables.php` - Spatie permissions

### Core Business Models
- `2025_11_18_103100_create_candidates_table.php` - MP Candidates
- `2025_11_18_103105_add_candidate_id_to_users_table.php` - Link users to candidates
- `2025_11_18_110000_create_templates_table.php` - Website templates
- `2025_11_18_110558_add_campaign_settings_to_candidates_table.php` - Campaign settings

### Donation System
- `2025_11_18_103500_create_donations_table.php` - Donation records
- `2025_11_18_103509_create_donation_ledgers_table.php` - Transparent ledger

### Citizen Engagement
- `2025_11_18_103946_create_feedback_table.php` - Feedback/Problem submissions
- `2025_11_18_104320_create_contacts_table.php` - Important contacts directory

### Campaign Modules
- `2025_11_18_110455_create_campaign_modules_tables.php` - All campaign features:
  - Knowledge entries (AI Chatbot)
  - Appointments
  - Announcements
  - Business hours
  - Contact messages
  - Events & RSVPs
  - Map locations
  - Media highlights
  - Engagement counters
  - Sales notifications
  - Polls & Poll options & Poll votes
  - Popups
  - Pricing tiers
  - Testimonials

### Multilingual Support
**Bengali (Bangla) language fields are integrated directly into each table creation migration:**
- **Candidates** (`2025_11_18_103100_create_candidates_table.php`): `name_bn`, `constituency_bn`, `party_bn`, `campaign_slogan_bn`, `campaign_goals_bn`
- **Donations** (`2025_11_18_103500_create_donations_table.php`): `donor_name_bn`
- **Feedback** (`2025_11_18_103946_create_feedback_table.php`): `name_bn`, `category_bn`, `description_bn`
- **Events** (`2025_11_18_110455_create_campaign_modules_tables.php`): `title_bn`, `description_bn`, `location_bn`
- **Testimonials** (`2025_11_18_110455_create_campaign_modules_tables.php`): `content_bn`, `author_name_bn`, `author_designation_bn`
- **Contacts** (`2025_11_18_104320_create_contacts_table.php`): `name_bn`, `category_bn`, `address`, `address_bn`
- **Polls** (`2025_11_18_110455_create_campaign_modules_tables.php`): `question_bn`
- **Poll Options** (`2025_11_18_110455_create_campaign_modules_tables.php`): `option_text`, `option_text_bn`

## Migration Best Practices

1. **Naming Convention**: `YYYY_MM_DD_HHMMSS_descriptive_name.php`
2. **Chronological Order**: Migrations run in timestamp order
3. **Consolidation**: Related changes should be grouped when possible
4. **Rollback Support**: Always implement `down()` method for reversibility
5. **Idempotency**: Use `Schema::hasColumn()` checks when adding columns that may already exist

## Running Migrations

```bash
# Run all pending migrations
php artisan migrate

# Rollback last batch
php artisan migrate:rollback

# Check migration status
php artisan migrate:status
```

