# Template Variables Reference

This document lists all available variables that can be used in the politian template.

## Basic Candidate Information

- `{{candidate.name}}` - Candidate's full name
- `{{candidate.name_bn}}` - Candidate's name in Bengali
- `{{candidate.image}}` - Full URL to candidate's profile image
- `{{candidate.campaign_slogan}}` - Campaign slogan
- `{{candidate.campaign_slogan_bn}}` - Campaign slogan in Bengali

## About & Biography

- `{{candidate.about}}` - About text (long text)
- `{{candidate.about_bn}}` - About text in Bengali
- `{{candidate.history}}` - History/biography text
- `{{candidate.history_bn}}` - History in Bengali
- `{{candidate.campaign_goals}}` - Campaign goals
- `{{candidate.campaign_goals_bn}}` - Campaign goals in Bengali

## Related Information

- `{{candidate.party.name}}` - Party name
- `{{candidate.party.name_bn}}` - Party name in Bengali
- `{{candidate.constituency.name}}` - Constituency name
- `{{candidate.constituency.name_bn}}` - Constituency name in Bengali

## URLs

- `{{donation_url}}` - URL to donation page: `/c/{candidate_id}/donate`
- `{{feedback_url}}` - URL to feedback form: `/c/{candidate_id}/f`
- `{{base_url}}` - Base application URL

## Usage Examples

### In HTML:
```html
<h1>{{candidate.name}}</h1>
<p>{{candidate.campaign_slogan}}</p>
<img src="{{candidate.image}}" alt="{{candidate.name}}">
<a href="{{donation_url}}">Donate Now</a>
```

### In Attributes:
```html
<a href="{{donation_url}}" class="btn">Donate</a>
<img src="{{candidate.image}}" alt="{{candidate.name}}">
```

## Notes

- All variables are optional - if data is missing, they will be replaced with empty strings
- Image URLs are automatically converted to full asset URLs
- URLs are automatically generated based on candidate ID
- Use `onerror` attribute for images to provide fallback:
  ```html
  <img src="{{candidate.image}}" onerror="this.src='assets/images/default.jpg'">
  ```

