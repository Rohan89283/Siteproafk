/*
  # Fix RLS Policies Completely

  1. Changes
    - Drop all existing shortlinks policies
    - Create clean, non-conflicting policies
    - Use simple session variables without subqueries
    - Separate policies for admin and user operations
    
  2. Security
    - Admins can do everything
    - Users can manage their own shortlinks
    - Public can view active shortlinks for redirects
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can create shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can update all shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can delete all shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can insert own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can view own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can view all shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can update own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can delete own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Public can view active shortlinks for redirect" ON shortlinks;

-- SELECT policies
CREATE POLICY "Allow public to view active shortlinks"
  ON shortlinks FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow users to view own shortlinks"
  ON shortlinks FOR SELECT
  USING (
    current_setting('app.user_id', true)::text IS NOT NULL 
    AND user_id::text = current_setting('app.user_id', true)::text
  );

CREATE POLICY "Allow admins to view all shortlinks"
  ON shortlinks FOR SELECT
  USING (
    current_setting('app.user_role', true) = 'admin'
  );

-- INSERT policies
CREATE POLICY "Allow authenticated users to create shortlinks"
  ON shortlinks FOR INSERT
  WITH CHECK (
    current_setting('app.user_id', true)::text IS NOT NULL
    AND user_id::text = current_setting('app.user_id', true)::text
  );

-- UPDATE policies
CREATE POLICY "Allow users to update own shortlinks"
  ON shortlinks FOR UPDATE
  USING (
    current_setting('app.user_id', true)::text IS NOT NULL 
    AND user_id::text = current_setting('app.user_id', true)::text
  )
  WITH CHECK (
    user_id::text = current_setting('app.user_id', true)::text
  );

CREATE POLICY "Allow admins to update all shortlinks"
  ON shortlinks FOR UPDATE
  USING (current_setting('app.user_role', true) = 'admin')
  WITH CHECK (current_setting('app.user_role', true) = 'admin');

-- DELETE policies
CREATE POLICY "Allow users to delete own shortlinks"
  ON shortlinks FOR DELETE
  USING (
    current_setting('app.user_id', true)::text IS NOT NULL 
    AND user_id::text = current_setting('app.user_id', true)::text
  );

CREATE POLICY "Allow admins to delete all shortlinks"
  ON shortlinks FOR DELETE
  USING (current_setting('app.user_role', true) = 'admin');
