# MDX File System Migration Guide

## Overview

The blog system has been migrated from Supabase database storage to a file-based MDX system. Blog posts are now stored as MDX files in the `content/posts/` directory.

## Key Changes

### Architecture

**Before:**
- Posts stored in Supabase `blog_posts` table
- Real-time database queries
- Required database connection for all operations

**After:**
- Posts stored as MDX files in `content/posts/` directory
- File system operations using Node.js `fs` module
- Gray-matter for parsing frontmatter
- Next.js Server Actions for file operations
- No database dependency

### File Structure

```
content/
└── posts/
    ├── getting-started-with-cloud-computing.mdx
    ├── ai-revolution-in-2024.mdx
    └── mental-health-in-tech.mdx
```

## MDX Post Format

Each blog post is a `.mdx` file with frontmatter and markdown content:

```mdx
---
title: Your Post Title
slug: your-post-slug
description: Brief description of your post
author: Author Name
authorBio: Short bio about the author
authorAvatar: https://images.pexels.com/photos/...
authorSocialLinks:
  twitter: https://twitter.com/username
  linkedin: https://linkedin.com/in/username
  github: https://github.com/username
category: AI
imageUrl: https://images.pexels.com/photos/...
readTime: 5 Minutes read
published: true
date: '2024-01-15'
tableOfContents:
  - id: 1
    title: Introduction
    anchor: introduction
  - id: 2
    title: Main Content
    anchor: main-content
---

Your markdown content goes here...

## Introduction

This is the introduction section...

## Main Content

More content here...
```

## New Libraries

### Dependencies Added

```json
{
  "gray-matter": "^4.0.3",
  "remark": "^15.0.0",
  "remark-html": "^16.0.0"
}
```

### Purpose

- **gray-matter**: Parse YAML frontmatter from MDX files
- **remark**: Markdown processor
- **remark-html**: Convert markdown to HTML

## Code Changes

### 1. MDX Utilities (`lib/mdx.ts`)

New utility functions for MDX file operations:

```typescript
- getAllPosts(): Get all posts from MDX files
- getPublishedPosts(): Get only published posts
- getPostBySlug(slug): Get specific post by slug
- savePost(slug, metadata, content): Create/update post
- deletePost(slug): Delete post file
```

### 2. Server Actions (`lib/actions.ts`)

Server actions for client-side components:

```typescript
- fetchAllPosts(): Fetch all posts
- fetchPostBySlug(slug): Fetch specific post
- createPost(metadata, content): Create new post
- updatePost(slug, metadata, content): Update existing post
- deletePost(slug): Delete post
- togglePublishPost(slug): Toggle publish status
```

### 3. Updated Pages

- `app/page.tsx`: Home page using `getPublishedPosts()`
- `app/blog/[slug]/page.tsx`: Blog detail using `getPostBySlug()`
- `app/admin/dashboard/page.tsx`: Admin dashboard using server actions
- `app/admin/posts/page.tsx`: All posts page using server actions
- `app/admin/posts/new/page.tsx`: Create post using `createPost()`
- `app/admin/posts/edit/[slug]/page.tsx`: Edit post using `updatePost()`

### 4. Next.js Configuration

```javascript
// next.config.js
experimental: {
  serverActions: true,
}
```

## Benefits

1. **Version Control**: Blog posts are now part of your Git repository
2. **Portability**: No database dependency, easy to migrate
3. **Performance**: Static file reading is fast
4. **Simplicity**: Direct file manipulation, no API calls
5. **Offline Development**: Work without database connection
6. **Backup**: Easy to backup (just commit to Git)

## Admin Panel Usage

### Creating Posts

1. Navigate to `/admin/login`
2. Login with credentials
3. Click "New Post" button
4. Fill in post details
5. Write content in MDX editor
6. Click "Create Post"
7. File is automatically created in `content/posts/`

### Editing Posts

1. Go to Dashboard or All Posts
2. Click "Edit" button on any post
3. Modify content/metadata
4. Click "Update Post"
5. File is automatically updated

### Publishing/Unpublishing

1. Click the eye icon on any post
2. Toggles `published: true/false` in frontmatter
3. Only published posts appear on the public blog

## Deployment Workflow

### Development

```bash
# Start development server
npm run dev

# Create/edit posts through admin panel
# Changes are saved immediately to MDX files
```

### Production Deployment

```bash
# Commit changes to Git
git add content/posts/
git commit -m "Add new blog post"
git push

# Build and deploy
npm run build
# Deploy to your hosting platform
```

### Important Notes

1. **File Persistence**: Changes are saved to the file system immediately
2. **Git Workflow**: Commit MDX files to version control to persist changes
3. **Revalidation**: Pages auto-revalidate after updates using Next.js revalidatePath
4. **Build Time**: Static generation happens at build time

## Sample Posts

Three sample posts are included:

1. **getting-started-with-cloud-computing.mdx** (Cloud category)
2. **ai-revolution-in-2024.mdx** (AI category)
3. **mental-health-in-tech.mdx** (Mental Health category)

## Migration from Supabase

If you have existing posts in Supabase:

1. Export posts from Supabase as JSON
2. Convert each post to MDX format
3. Save as `{slug}.mdx` in `content/posts/`
4. Ensure all frontmatter fields are present

## Troubleshooting

### Post Not Showing

- Check if file exists in `content/posts/`
- Verify frontmatter format is correct
- Ensure `published: true` in frontmatter
- Check slug matches filename

### Edit Page Errors

- Verify slug in URL is correct
- Ensure MDX file exists
- Check file permissions

### Build Errors

- Validate MDX frontmatter syntax
- Check for missing required fields
- Ensure dates are in ISO format

## Future Enhancements

Potential improvements:

1. **GitHub Integration**: Auto-commit changes to GitHub
2. **Image Upload**: Upload images instead of URLs
3. **Draft Previews**: Preview unpublished posts
4. **Version History**: Track post revisions
5. **SEO Metadata**: Additional SEO fields

## Support

For issues or questions about the MDX system, refer to:
- Gray-matter docs: https://github.com/jonschlinkert/gray-matter
- Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations
