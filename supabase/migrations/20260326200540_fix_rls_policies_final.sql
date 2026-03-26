/*
  # Fix RLS Policies for Shortlinks - Final

  1. Changes
    - Drop all existing shortlinks policies
    - Create simplified policies that work with session variables
    - Ensure INSERT works correctly for authenticated users

  2. Security
    - Users can only insert/view/update/delete their own shortlinks
    - Admins can view all shortlinks but only modify their own
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can view all shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can insert own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can update own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can delete own shortlinks" ON shortlinks;

-- Policy 1: Users can INSERT their own shortlinks
CREATE POLICY "Users can insert own shortlinks"
  ON shortlinks FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id::text = current_setting('app.user_id', true)
  );

-- Policy 2: Users can SELECT their own shortlinks
CREATE POLICY "Users can view own shortlinks"
  ON shortlinks FOR SELECT
  TO authenticated
  USING (
    user_id::text = current_setting('app.user_id', true)
  );

-- Policy 3: Admins can SELECT all shortlinks
CREATE POLICY "Admins can view all shortlinks"
  ON shortlinks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE id::text = current_setting('app.user_id', true)
      AND role = 'admin'
    )
  );

-- Policy 4: Users can UPDATE their own shortlinks
CREATE POLICY "Users can update own shortlinks"
  ON shortlinks FOR UPDATE
  TO authenticated
  USING (
    user_id::text = current_setting('app.user_id', true)
  )
  WITH CHECK (
    user_id::text = current_setting('app.user_id', true)
  );

-- Policy 5: Users can DELETE their own shortlinks
CREATE POLICY "Users can delete own shortlinks"
  ON shortlinks FOR DELETE
  TO authenticated
  USING (
    user_id::text = current_setting('app.user_id', true)
  );

-- Also allow public access to read shortlinks for redirect functionality
CREATE POLICY "Public can view active shortlinks for redirect"
  ON shortlinks FOR SELECT
  TO anon
  USING (is_active = true);
