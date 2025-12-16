# SEO Management System Guide

## Overview

The SEO management system allows admins to configure SEO metadata (meta tags, Open Graph tags, Twitter Card tags, etc.) for all pages in the application. SEO data is stored as JSON files in the `content/seo/` directory, following the same file-based approach as blog posts and FAQs.

## Storage Structure

```
content/
└── seo/
    ├── homepage.json
    ├── blog.json
    ├── about.json
    └── contact.json
```

Each page has its own JSON file containing all SEO metadata.

## SEO Metadata Fields

Each SEO file contains the following fields:

### Basic SEO
- **title**: Page title (50-60 characters recommended)
- **description**: Meta description (150-160 characters recommended)
- **keywords**: Comma-separated keywords for search engines

### Open Graph (Facebook, LinkedIn)
- **ogTitle**: Title for social media sharing (defaults to page title)
- **ogDescription**: Description for social shares (defaults to meta description)
- **ogImage**: Image URL for social shares (1200x630px recommended)
- **ogType**: Content type (website, article, product, etc.)

### Twitter Card
- **twitterCard**: Card type (summary, summary_large_image, app, player)
- **twitterTitle**: Title for Twitter (defaults to page title)
- **twitterDescription**: Description for Twitter (defaults to meta description)
- **twitterImage**: Image for Twitter (defaults to OG image)

### Advanced
- **canonicalUrl**: Canonical URL for the page (prevents duplicate content)
- **robots**: Search engine directives (index, follow / noindex, nofollow)
- **updatedAt**: Last update timestamp (auto-generated)

## Admin Panel Usage

### Accessing SEO Management

1. Login to the admin panel at `/admin/login`
2. Click "SEO" in the navigation menu
3. You'll see all configured SEO pages

### Creating New SEO Page

1. Click "New SEO Page" button
2. Enter a **page identifier** (e.g., "homepage", "about", "contact")
   - Use lowercase, no spaces
   - Use hyphens for multi-word pages (e.g., "about-us")
3. Fill in the SEO metadata:
   - **Basic SEO**: Title, description, keywords
   - **Open Graph**: Social media sharing settings
   - **Twitter Card**: Twitter-specific settings
   - **Advanced**: Canonical URL, robots directives
4. Click "Create SEO Page"

### Editing SEO Settings

1. From the SEO Management page, click "Edit" on any page
2. Update the metadata as needed
3. Click "Update SEO"

### Quick Links for Common Pages

The SEO Management page provides quick links for common pages:
- homepage
- blog
- about
- services
- contact
- privacy
- terms

Click any page to configure its SEO settings. Pages not yet configured will show "Not configured".

## File Format

SEO files are stored as JSON:

```json
{
  "title": "Page Title - Your Brand",
  "description": "Brief description of the page for search engines",
  "ogTitle": "Title for Social Sharing",
  "ogDescription": "Description for social media",
  "ogImage": "https://example.com/image.jpg",
  "ogType": "website",
  "twitterCard": "summary_large_image",
  "twitterTitle": "Title for Twitter",
  "twitterDescription": "Description for Twitter",
  "twitterImage": "https://example.com/image.jpg",
  "keywords": "keyword1, keyword2, keyword3",
  "canonicalUrl": "https://example.com/page",
  "robots": "index, follow",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

## Implementation Details

### SEO Component

The `SEOHead` component (`components/SEOHead.tsx`) loads SEO metadata for a page and returns Next.js metadata format.

### Usage in Pages

#### Static Pages (Root Layout)

```typescript
import SEOHead from '@/components/SEOHead';

export const metadata = SEOHead({
  page: 'homepage',
  fallbackTitle: 'Default Title',
  fallbackDescription: 'Default Description'
});
```

#### Dynamic Pages (Blog Posts)

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return SEOHead({
    page: `blog-${params.slug}`,
    fallbackTitle: `${blogTitle} | Hexpertify Blog`,
    fallbackDescription: blogDescription,
  });
}
```

### Page Identifiers

Page identifiers are used to map SEO files to pages:

- **Static pages**: Use simple identifiers (e.g., "homepage", "about")
- **Dynamic pages**: Prefix with type (e.g., "blog-post-slug")
- **Blog posts**: Use "blog-{slug}" format

## Best Practices

### Title Tags
- Keep titles 50-60 characters
- Include target keywords near the beginning
- Add brand name at the end
- Make each page title unique

### Meta Descriptions
- Keep descriptions 150-160 characters
- Include a call-to-action
- Use active voice
- Include target keywords naturally
- Make each description unique

### Open Graph Images
- Use 1200x630px images
- Ensure text is readable at small sizes
- Avoid important content at edges
- Use high-quality images
- Test how they look when shared

### Keywords
- Focus on 5-10 relevant keywords per page
- Include long-tail keywords
- Use natural language
- Don't keyword stuff

### Canonical URLs
- Use for duplicate content
- Always use absolute URLs
- Point to the preferred version
- Use consistently across pages

### Robots Directives
- Use "index, follow" for public pages
- Use "noindex, nofollow" for private pages
- Use "noindex, follow" for duplicate content
- Use "index, nofollow" for user-generated content

## Common Page Types

### Homepage
```json
{
  "title": "Brand Name - Tagline",
  "description": "Brief description of what your site offers",
  "ogType": "website",
  "robots": "index, follow"
}
```

### Blog Posts
```json
{
  "title": "Article Title | Brand Name",
  "description": "Article summary or excerpt",
  "ogType": "article",
  "robots": "index, follow"
}
```

### About Page
```json
{
  "title": "About Us | Brand Name",
  "description": "Learn about our company, mission, and team",
  "ogType": "website",
  "robots": "index, follow"
}
```

### Contact Page
```json
{
  "title": "Contact Us | Brand Name",
  "description": "Get in touch with us - phone, email, and location",
  "ogType": "website",
  "robots": "index, follow"
}
```

## Testing SEO

### Preview in Search Results
1. Use Google's Rich Results Test
2. Use Twitter Card Validator
3. Use Facebook Sharing Debugger

### Check Implementation
1. View page source
2. Look for meta tags in `<head>`
3. Verify all tags are present and correct

### Monitor Performance
1. Use Google Search Console
2. Track click-through rates
3. Monitor rankings for target keywords
4. Analyze social sharing metrics

## Troubleshooting

### SEO Not Appearing
- Verify the SEO file exists in `content/seo/`
- Check the page identifier matches exactly
- Ensure JSON format is valid
- Clear Next.js cache and rebuild

### Social Shares Not Working
- Verify image URLs are absolute
- Check image dimensions (1200x630px)
- Test with Facebook Sharing Debugger
- Test with Twitter Card Validator

### Changes Not Reflecting
- Rebuild the application (`npm run build`)
- Clear browser cache
- Force refresh social media caches

## Future Enhancements

Potential improvements:
- Schema.org structured data
- XML sitemap generation
- Automatic SEO auditing
- Bulk import/export
- SEO templates by page type
- A/B testing for titles/descriptions

## Support

For technical issues or questions about the SEO system:
- Check this guide thoroughly
- Review the implementation in `lib/seo.ts`
- Test in the admin panel at `/admin/seo`
- Verify SEO files in `content/seo/`
