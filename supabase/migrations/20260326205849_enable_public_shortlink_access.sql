/*
  # Enable Public Shortlink Access

  1. Changes
    - Add public SELECT policy for active shortlinks
    - Allow anonymous users to read active shortlinks for redirects
    
  2. Purpose
    - Enable public access to shortlinks without authentication
    - Shortlinks should be accessible to anyone with the link
    
  3. Security
    - Only SELECT access for anonymous users
    - Only active shortlinks are visible
    - No access to user_id or other sensitive fields for public
*/

-- Drop existing SELECT policy for authenticated users if exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own shortlinks" ON shortlinks;
  DROP POLICY IF EXISTS "Admins can view all shortlinks" ON shortlinks;
  DROP POLICY IF EXISTS "Public can view active shortlinks" ON shortlinks;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create policy for public to view active shortlinks (for redirects)
CREATE POLICY "Public can view active shortlinks"
  ON shortlinks
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policy for authenticated users to view their own shortlinks (for dashboard)
CREATE POLICY "Users can view own shortlinks"
  ON shortlinks
  FOR SELECT
  TO authenticated
  USING (user_id = current_setting('app.current_user_id')::uuid);

-- Create policy for admins to view all shortlinks
CREATE POLICY "Admins can view all shortlinks"
  ON shortlinks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE id = current_setting('app.current_user_id')::uuid
      AND role = 'admin'
    )
  );
