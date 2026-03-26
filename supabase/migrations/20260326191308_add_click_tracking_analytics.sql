/*
  # Add Click Tracking and Analytics

  1. New Tables
    - `click_analytics`
      - `id` (uuid, primary key)
      - `shortlink_id` (uuid, references shortlinks)
      - `clicked_at` (timestamptz)
      - `user_agent` (text) - Browser user agent string
      - `platform` (text) - Mobile, Desktop, Tablet, etc.
      - `device` (text) - Device name
      - `browser` (text) - Browser name
      - `os` (text) - Operating system
      - `referrer` (text) - Where the click came from
      - `ip_address` (text) - IP address (optional)
      - `country` (text) - Country code (optional)

  2. Security
    - Enable RLS
    - Users can view analytics for their own shortlinks
    - Admins can view all analytics
    - System can insert analytics (public insert for tracking)
*/

-- Create click analytics table
CREATE TABLE IF NOT EXISTS click_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shortlink_id uuid REFERENCES shortlinks(id) ON DELETE CASCADE NOT NULL,
  clicked_at timestamptz DEFAULT now() NOT NULL,
  user_agent text DEFAULT '',
  platform text DEFAULT '',
  device text DEFAULT '',
  browser text DEFAULT '',
  os text DEFAULT '',
  referrer text DEFAULT '',
  ip_address text DEFAULT '',
  country text DEFAULT ''
);

-- Enable RLS
ALTER TABLE click_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics (for public tracking)
CREATE POLICY "Anyone can insert click analytics"
  ON click_analytics FOR INSERT
  WITH CHECK (true);

-- Users can view analytics for their own shortlinks
CREATE POLICY "Users can view own shortlink analytics"
  ON click_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shortlinks
      WHERE shortlinks.id = click_analytics.shortlink_id
      AND shortlinks.user_id::text = current_setting('app.user_id', true)
    )
  );

-- Admins can view all analytics
CREATE POLICY "Admins can view all analytics"
  ON click_analytics FOR SELECT
  USING (current_setting('app.user_role', true) = 'admin');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_click_analytics_shortlink_id ON click_analytics(shortlink_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_clicked_at ON click_analytics(clicked_at);
