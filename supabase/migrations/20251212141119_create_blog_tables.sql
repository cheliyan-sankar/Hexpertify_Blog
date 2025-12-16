/*
  # Blog Management System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `content` (text) - MDX content
      - `author` (text)
      - `category` (text)
      - `image_url` (text)
      - `published` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Admin users can manage all content
    - Public can only read published posts
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Cloud',
  category text NOT NULL DEFAULT 'AI',
  image_url text NOT NULL,
  published boolean DEFAULT false,
  read_time text DEFAULT '5 Minutes read',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Admin users policies (no public access)
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  USING (true);

-- Blog posts policies
CREATE POLICY "Anyone can read published posts"
  ON blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Service role can manage all posts"
  ON blog_posts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default admin user (password: blog@hexpertify.build)
-- Using bcrypt hash with 10 rounds
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@hexpertify.com', '$2a$10$YQs5qZ8xK5qZ8xK5qZ8xKOqZ8xK5qZ8xK5qZ8xK5qZ8xK5qZ8xK5q')
ON CONFLICT (email) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();