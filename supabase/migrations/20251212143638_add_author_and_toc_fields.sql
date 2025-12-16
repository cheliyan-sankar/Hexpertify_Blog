/*
  # Add Author Details and Table of Contents Fields

  1. Changes to blog_posts table
    - Add author_bio (text) - Biography/description of the author
    - Add author_avatar (text) - URL to author's avatar image
    - Add author_social_links (jsonb) - Social media links (twitter, linkedin, etc.)
    - Add table_of_contents (jsonb) - Array of table of contents items
    - Keep existing author field for backwards compatibility
  
  2. Notes
    - author_social_links will store: {"twitter": "url", "linkedin": "url", "github": "url"}
    - table_of_contents will store: [{"id": 1, "title": "Section Title", "anchor": "section-1"}]
*/

-- Add new columns to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'author_bio'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author_bio text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'author_avatar'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author_avatar text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'author_social_links'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author_social_links jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'table_of_contents'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN table_of_contents jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;
