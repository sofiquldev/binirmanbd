# Template Build Guide

Complete guide for creating and building candidate landing page templates.

## Table of Contents

1. [Overview](#overview)
2. [Template Structure](#template-structure)
3. [Creating a Template](#creating-a-template)
4. [Template Configuration](#template-configuration)
5. [Using Variables](#using-variables)
6. [Asset Management](#asset-management)
7. [Testing Your Template](#testing-your-template)
8. [Publishing Your Template](#publishing-your-template)

---

## Overview

Templates are self-contained HTML packages that can be uploaded and used for candidate landing pages. Each template is stored in `public/templates/{template-slug}/` and includes:

- HTML files (with template variables)
- CSS, JavaScript, and image assets
- Configuration file (`template.json`)
- Preview thumbnail (`thumb.jpg`)

---

## Template Structure

### Required Structure

```
your-template-name/
├── template.json          # Required: Template configuration
├── thumb.jpg             # Required: Preview thumbnail (800x600px recommended)
├── index.html            # Required: Main template file (or entry file)
├── assets/               # Required: All static assets
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── images/          # Images and media
│   └── fonts/          # Font files (optional)
└── [other HTML files]   # Optional: Additional pages
```

### Directory Layout

```
public/templates/
├── your-template-name/
│   ├── template.json
│   ├── thumb.jpg
│   ├── index.html
│   └── assets/
│       ├── css/
│       │   └── style.css
│       ├── js/
│       │   └── script.js
│       └── images/
│           └── logo.png
└── another-template/
    └── ...
```

---

## Creating a Template

### Step 1: Create Template Directory

1. Create a new folder in `public/templates/`
2. Use a slug-friendly name (lowercase, hyphens): `my-awesome-template`
3. This will be your template's slug

### Step 2: Create Template Configuration

Create `template.json` in your template directory:

```json
{
  "name": "My Awesome Template",
  "slug": "my-awesome-template",
  "version": "1.0.0",
  "description": "A beautiful template for political candidates",
  "author": "Your Name",
  "preview_image": "thumb.jpg",
  "entry_file": "index.html",
  "assets_path": "assets",
  "variables": {
    "candidate_name": "{{candidate.name}}",
    "candidate_image": "{{candidate.image}}",
    "donation_url": "{{url('/c/' ~ candidate.id ~ '/donate')}}"
  }
}
```

### Step 3: Create Preview Thumbnail

1. Create a preview image named `thumb.jpg`
2. Recommended size: 800x600px or 1200x900px
3. This image will be shown in the template selector
4. Place it in your template root directory

### Step 4: Build Your HTML

Create your `index.html` file with template variables (see [Using Variables](#using-variables) section).

---

## Template Configuration

### template.json Schema

```json
{
  "name": "Template Display Name",
  "slug": "template-slug",
  "version": "1.0.0",
  "description": "Template description",
  "author": "Author name",
  "preview_image": "thumb.jpg",
  "entry_file": "index.html",
  "assets_path": "assets",
  "variables": {
    "custom_var": "{{candidate.name}}"
  },
  "sections": {
    "hero": {
      "enabled": true,
      "file": "sections/hero.html"
    }
  }
}
```

### Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name of the template |
| `slug` | string | Yes | Unique identifier (folder name) |
| `version` | string | No | Template version (e.g., "1.0.0") |
| `description` | string | No | Template description |
| `author` | string | No | Template author name |
| `preview_image` | string | Yes | Preview thumbnail filename |
| `entry_file` | string | Yes | Main HTML file (usually "index.html") |
| `assets_path` | string | No | Assets folder name (default: "assets") |
| `variables` | object | No | Custom variable mappings |
| `sections` | object | No | Optional section definitions |

---

## Using Variables

### Available Variables

#### Candidate Information

```html
<!-- Basic Info -->
{{candidate.name}}                    <!-- Candidate name -->
{{candidate.name_bn}}                  <!-- Candidate name in Bengali -->
{{candidate.image}}                   <!-- Full URL to candidate image -->
{{candidate.campaign_slogan}}         <!-- Campaign slogan -->
{{candidate.campaign_slogan_bn}}      <!-- Campaign slogan in Bengali -->

<!-- Biography -->
{{candidate.about}}                   <!-- About text (multiline supported) -->
{{candidate.about_bn}}                <!-- About text in Bengali -->
{{candidate.history}}                 <!-- History/biography -->
{{candidate.history_bn}}              <!-- History in Bengali -->
{{candidate.campaign_goals}}          <!-- Campaign goals -->
{{candidate.campaign_goals_bn}}       <!-- Campaign goals in Bengali -->
```

#### Related Information

```html
{{candidate.party.name}}              <!-- Party name -->
{{candidate.party.name_bn}}           <!-- Party name in Bengali -->
{{candidate.constituency.name}}       <!-- Constituency name -->
{{candidate.constituency.name_bn}}    <!-- Constituency name in Bengali -->
```

#### URLs

```html
{{donation_url}}                      <!-- Donation page URL -->
{{feedback_url}}                      <!-- Feedback form URL -->
{{base_url}}                         <!-- Base application URL -->
```

### Variable Usage Examples

#### In HTML Content

```html
<h1>{{candidate.name}}</h1>
<p>{{candidate.campaign_slogan}}</p>
<div class="about">
    {{candidate.about}}
</div>
```

#### In Attributes

```html
<img src="{{candidate.image}}" alt="{{candidate.name}}">
<a href="{{donation_url}}" class="btn">Donate Now</a>
```

#### With Fallbacks

```html
<!-- Image with fallback -->
<img src="{{candidate.image}}" 
     alt="{{candidate.name}}" 
     onerror="this.src='assets/images/default-avatar.jpg'">

<!-- Conditional display -->
{{#if candidate.campaign_slogan}}
    <p class="slogan">{{candidate.campaign_slogan}}</p>
{{/if}}
```

#### Multiline Text

The system automatically converts newlines to `<br>` tags for:
- `{{candidate.about}}`
- `{{candidate.about_bn}}`
- `{{candidate.history}}`
- `{{candidate.history_bn}}`
- `{{candidate.campaign_goals}}`
- `{{candidate.campaign_goals_bn}}`

---

## Asset Management

### Asset Paths

All relative asset paths are automatically updated by the system:

**In your template:**
```html
<link href="assets/css/style.css" rel="stylesheet">
<script src="assets/js/script.js"></script>
<img src="assets/images/logo.png" alt="Logo">
```

**Rendered as:**
```html
<link href="/templates/your-template/assets/css/style.css" rel="stylesheet">
<script src="/templates/your-template/assets/js/script.js"></script>
<img src="/templates/your-template/assets/images/logo.png" alt="Logo">
```

### Asset Organization

```
assets/
├── css/
│   ├── bootstrap.css
│   ├── custom.css
│   └── responsive.css
├── js/
│   ├── jquery.js
│   ├── main.js
│   └── plugins.js
├── images/
│   ├── logo.png
│   ├── hero-bg.jpg
│   └── icons/
│       └── icon.svg
└── fonts/
    ├── font.woff
    └── font.woff2
```

### Best Practices

1. **Use relative paths**: Always use relative paths starting with `assets/`
2. **Organize by type**: Group CSS, JS, images in separate folders
3. **Optimize assets**: Compress images, minify CSS/JS for production
4. **Use CDN for libraries**: Consider using CDN for common libraries (jQuery, Bootstrap)
5. **Font loading**: Use web fonts with proper fallbacks

---

## Testing Your Template

### Local Testing

1. **Place template in directory**:
   ```
   public/templates/my-template/
   ```

2. **Sync to database**:
   ```bash
   php artisan templates:sync
   ```

3. **Assign to candidate**:
   - Via Admin Panel: Select template for candidate
   - Via API: `PUT /api/v1/candidates/{id}` with `template_id`

4. **View landing page**:
   ```
   http://your-domain.com/c/{candidate-slug}
   ```

### Testing Checklist

- [ ] Template loads without errors
- [ ] All assets (CSS, JS, images) load correctly
- [ ] Variables are replaced with candidate data
- [ ] Images display correctly (with fallbacks)
- [ ] Donation links work
- [ ] Responsive design works on mobile
- [ ] All interactive elements function
- [ ] No console errors

---

## Publishing Your Template

### Method 1: ZIP Upload (Recommended)

1. **Create ZIP file**:
   ```
   my-template.zip
   ├── template.json
   ├── thumb.jpg
   ├── index.html
   └── assets/
       ├── css/
       ├── js/
       └── images/
   ```

2. **Upload via API**:
   ```bash
   POST /api/v1/templates/upload
   Content-Type: multipart/form-data
   
   template_zip: [file]
   slug: my-template (optional)
   ```

3. **Or via Admin Panel** (if implemented):
   - Navigate to Templates section
   - Click "Upload Template"
   - Select ZIP file
   - Template will be extracted and registered

### Method 2: Manual Installation

1. **Extract template**:
   - Extract ZIP to `public/templates/{template-slug}/`
   - Ensure `template.json` exists
   - Ensure `thumb.jpg` exists

2. **Sync to database**:
   ```bash
   php artisan templates:sync
   ```

3. **Verify**:
   - Check template appears in template list
   - Test with a candidate

---

## Template Examples

### Minimal Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{candidate.name}} - Campaign</title>
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <header>
        <h1>{{candidate.name}}</h1>
        <p>{{candidate.campaign_slogan}}</p>
    </header>
    <main>
        <img src="{{candidate.image}}" alt="{{candidate.name}}">
        <div class="about">
            {{candidate.about}}
        </div>
        <a href="{{donation_url}}" class="btn">Donate Now</a>
    </main>
    <script src="assets/js/script.js"></script>
</body>
</html>
```

### Advanced Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{candidate.name}} - {{candidate.constituency.name}}</title>
    
    <!-- CSS -->
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <link href="assets/css/custom.css" rel="stylesheet">
</head>
<body>
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>{{candidate.name}}</h1>
            <p class="subtitle">{{candidate.constituency.name}}</p>
            <p class="slogan">{{candidate.campaign_slogan}}</p>
            <img src="{{candidate.image}}" 
                 alt="{{candidate.name}}"
                 onerror="this.src='assets/images/default.jpg'">
            <a href="{{donation_url}}" class="btn-primary">Donate Now</a>
        </div>
    </section>

    <!-- About Section -->
    <section class="about">
        <h2>About {{candidate.name}}</h2>
        <div class="content">
            {{candidate.about}}
        </div>
        <div class="info">
            <p><strong>Party:</strong> {{candidate.party.name}}</p>
            <p><strong>Constituency:</strong> {{candidate.constituency.name}}</p>
        </div>
    </section>

    <!-- Campaign Goals -->
    {{#if candidate.campaign_goals}}
    <section class="goals">
        <h2>Campaign Goals</h2>
        <div class="content">
            {{candidate.campaign_goals}}
        </div>
    </section>
    {{/if}}

    <!-- Footer -->
    <footer>
        <a href="{{donation_url}}">Support the Campaign</a>
        <a href="{{feedback_url}}">Send Feedback</a>
    </footer>

    <!-- JavaScript -->
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
```

---

## Best Practices

### 1. Template Design

- ✅ **Responsive**: Ensure mobile-friendly design
- ✅ **Fast Loading**: Optimize images and assets
- ✅ **Accessible**: Use semantic HTML, proper alt texts
- ✅ **SEO Friendly**: Include meta tags, proper headings

### 2. Variable Usage

- ✅ **Always provide fallbacks**: Use `onerror` for images
- ✅ **Handle empty values**: Check if variables exist before using
- ✅ **Escape HTML**: System handles escaping automatically
- ✅ **Use semantic HTML**: Proper heading hierarchy

### 3. Asset Management

- ✅ **Relative paths only**: Use `assets/` not absolute paths
- ✅ **Organize assets**: Group by type (css, js, images)
- ✅ **Optimize files**: Minify CSS/JS, compress images
- ✅ **Version assets**: Consider cache-busting for updates

### 4. Testing

- ✅ **Test with real data**: Use actual candidate data
- ✅ **Test all variables**: Ensure all variables work
- ✅ **Test on devices**: Mobile, tablet, desktop
- ✅ **Test browsers**: Chrome, Firefox, Safari, Edge

---

## Troubleshooting

### Template Not Appearing

1. Check `template.json` exists and is valid JSON
2. Verify `thumb.jpg` exists
3. Run `php artisan templates:sync`
4. Check file permissions

### Variables Not Replacing

1. Verify variable syntax: `{{candidate.name}}` (double curly braces)
2. Check candidate has data for that field
3. Check TemplateService is processing correctly
4. View page source to see if variables are in HTML

### Assets Not Loading

1. Verify assets are in `assets/` folder
2. Check paths are relative (not absolute)
3. Check browser console for 404 errors
4. Verify asset paths are being updated correctly

### Template Rendering Errors

1. Check Laravel logs: `storage/logs/laravel.log`
2. Verify candidate has required relationships loaded
3. Check for PHP errors in template processing
4. Test with minimal template first

---

## Template Variables Reference

See `VARIABLES.md` for complete list of available variables.

### Quick Reference

| Variable | Description |
|---------|-------------|
| `{{candidate.name}}` | Candidate name |
| `{{candidate.image}}` | Candidate image URL |
| `{{candidate.campaign_slogan}}` | Campaign slogan |
| `{{candidate.about}}` | About text |
| `{{candidate.party.name}}` | Party name |
| `{{candidate.constituency.name}}` | Constituency name |
| `{{donation_url}}` | Donation page URL |
| `{{feedback_url}}` | Feedback form URL |

---

## Support

For issues or questions:
1. Check this documentation
2. Review existing templates (e.g., `politian`)
3. Check Laravel logs
4. Verify template structure matches requirements

---

## Version History

- **v1.0.0** - Initial template system
  - Basic variable replacement
  - Asset path handling
  - ZIP upload support

