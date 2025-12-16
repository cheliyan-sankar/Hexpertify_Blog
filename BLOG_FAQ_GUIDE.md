# Blog-Specific FAQ System Guide

## Overview

Each blog post can have its own unique set of FAQs that appear at the bottom of the post page. FAQs are stored as MDX files in the `content/faqs/` directory, following the same file-based approach as blog posts.

## How It Works

### Storage Structure

```
content/
├── posts/                           # Blog posts
│   ├── getting-started-with-cloud-computing.mdx
│   ├── ai-revolution-in-2024.mdx
│   └── mental-health-in-tech.mdx
└── faqs/                            # FAQ files
    ├── what-is-hexpertify.mdx       # Homepage FAQ
    ├── cloud-benefits.mdx           # Blog-specific FAQ
    ├── cloud-security.mdx           # Blog-specific FAQ
    └── ai-job-impact.mdx            # Blog-specific FAQ
```

### FAQ File Format

Each FAQ is an MDX file with frontmatter:

```mdx
---
question: Your question here?
answer: Your detailed answer here.
category: Category Name
published: true
order: 1
createdAt: '2024-01-15'
relatedTo: getting-started-with-cloud-computing
---
```

### Key Field: `relatedTo`

The `relatedTo` field determines where the FAQ appears:

- **`homepage`** - FAQ appears on the homepage
- **`[blog-slug]`** - FAQ appears on the specific blog post page (e.g., `getting-started-with-cloud-computing`)

## Creating Blog-Specific FAQs

### Via Admin Panel

1. Go to `/admin/faqs`
2. Click "New FAQ"
3. Fill in the question and answer
4. In the "Related To" dropdown:
   - Select "Homepage" for general FAQs
   - Select a specific blog post slug for blog-specific FAQs
5. Set the display order (lower numbers appear first)
6. Check "Publish immediately" or save as draft
7. Click "Create FAQ"

### Example Use Cases

**Homepage FAQs** (relatedTo: `homepage`):
- General questions about your platform
- Booking and pricing information
- How to become a consultant

**Blog-Specific FAQs** (relatedTo: `[blog-slug]`):

For "Getting Started with Cloud Computing" blog:
- What are the cost benefits of cloud computing?
- Is cloud computing secure?
- Which cloud provider should I choose?

For "AI Revolution in 2024" blog:
- Will AI replace jobs?
- How can I start learning AI?
- What are the ethical concerns with AI?

## Viewing FAQs

### On Blog Pages

FAQs automatically appear at the bottom of blog posts if:
1. The FAQ's `relatedTo` field matches the blog post slug
2. The FAQ is published (`published: true`)

### On Homepage

FAQs with `relatedTo: homepage` appear in the FAQ section on the homepage.

## Managing FAQs

### List All FAQs
Navigate to `/admin/faqs` to see all FAQs with their:
- Question
- Category
- Related page
- Display order
- Published status

### Edit FAQ
1. Click the edit icon on any FAQ
2. Modify the content
3. Change the "Related To" field to move it to a different page
4. Save changes

### Delete FAQ
Click the delete icon and confirm the deletion.

### Publish/Unpublish
Click the eye icon to toggle the published status.

## Technical Implementation

### Functions Used

From `lib/faqs.ts`:
- `getFAQsByPage(pageName)` - Retrieves all published FAQs for a specific page
- `getAllFAQs()` - Gets all FAQs (used in admin panel)
- `saveFAQ(id, metadata)` - Creates or updates an FAQ
- `deleteFAQ(id)` - Deletes an FAQ file

### Blog Page Implementation

In `app/blog/[slug]/page.tsx`:

```typescript
const faqs = getFAQsByPage(params.slug);

// ...

<FAQSection faqs={faqs} />
```

This automatically fetches and displays FAQs related to the current blog post.

## Best Practices

1. **Relevant Content**: Create FAQs that directly relate to the blog post topic
2. **Clear Answers**: Provide detailed, helpful answers
3. **Logical Order**: Use the `order` field to arrange FAQs from most to least common
4. **Consistent Categories**: Use meaningful category names for better organization
5. **Review Regularly**: Update FAQs as needed when blog content changes

## Current Examples

### Cloud Computing Blog FAQs
- Cost benefits
- Security concerns
- Provider comparison

### AI Revolution Blog FAQs
- Job impact
- Learning resources
- Ethical considerations

### Mental Health Blog FAQs
- Burnout signs
- Accessing support
- Work-life boundaries

## Adding FAQs to New Blogs

When creating a new blog post:

1. Publish the blog post first
2. Create 3-5 relevant FAQs
3. Set `relatedTo` to the new blog's slug
4. Order them by importance
5. Publish the FAQs

The FAQs will automatically appear at the bottom of your blog post!

## File Naming Convention

FAQ filenames should be descriptive and use kebab-case:
- `cloud-benefits.mdx` ✓
- `ai-job-impact.mdx` ✓
- `work-life-balance.mdx` ✓
- `faq1.mdx` ✗ (not descriptive)

## Troubleshooting

**FAQs not showing on blog page?**
- Verify the `relatedTo` field matches the blog post slug exactly
- Ensure `published: true` in the FAQ file
- Check that the FAQ file exists in `content/faqs/`

**Can't see blog slugs in dropdown?**
- Make sure you have published blog posts
- The admin panel loads blog slugs automatically

**Wrong display order?**
- Check the `order` field in each FAQ
- Lower numbers appear first (1, 2, 3...)

## Summary

The blog-specific FAQ system provides a flexible, file-based approach to adding contextual FAQs to your blog posts. By using the `relatedTo` field, you can easily associate FAQs with specific pages without any database setup. This keeps your content organized, version-controlled, and easy to manage.
