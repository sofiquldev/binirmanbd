# Politian Template

This is the Politian political campaign template for candidate landing pages.

## Files Location

All template files are located in: `public/templates/politian/`

- **HTML files**: All `.html` files (index.html, about.html, etc.)
- **Assets**: `assets/` folder containing CSS, JS, images, fonts
- **Config**: `template.json` - Template configuration
- **Preview**: `thumb.jpg` - Preview thumbnail (add this file)

## Template Variables

See `VARIABLES.md` for a complete list of available variables.

### Key Variables Used in index.html:

- `{{candidate.name}}` - Candidate name (used in title, hero, about)
- `{{candidate.image}}` - Candidate profile image
- `{{candidate.campaign_slogan}}` - Campaign slogan
- `{{candidate.about}}` - About text (supports multiline)
- `{{candidate.constituency.name}}` - Constituency name
- `{{candidate.party.name}}` - Party name
- `{{donation_url}}` - Donation page URL

## Asset Paths

All asset paths are automatically updated by the TemplateService:
- `assets/css/style.css` → `/templates/politian/assets/css/style.css`
- `assets/js/script.js` → `/templates/politian/assets/js/script.js`
- `assets/images/logo.svg` → `/templates/politian/assets/images/logo.svg`

## Next Steps

1. **Add preview image**: Create `thumb.jpg` in this directory
2. **Sync to database**: Run `php artisan templates:sync`
3. **Assign to candidate**: Set `template_id` in candidate record
4. **Test**: Visit `/c/{candidate-slug}` to see the template

## Template Structure

```
politian/
├── template.json          ✅ Configuration
├── thumb.jpg             ⚠️  Need to add
├── index.html            ✅ Main template (with variables)
├── assets/               ✅ All CSS, JS, images
└── [other HTML files]    ✅ Additional pages
```

