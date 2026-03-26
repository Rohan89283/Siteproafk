/*
  # Update Shortlinks RLS Policies for Admin Access

  1. Changes
    - Drop existing shortlinks policies
    - Add policies to allow admins to create, view, update, and delete all shortlinks
    - Users can still manage their own shortlinks

  2. Security
    - Uses session settings (app.user_id and app.user_role)
    - Admins have full access to all shortlinks
    - Users can only access their own shortlinks
*/

-- Drop all existing policies on shortlinks
DROP POLICY IF EXISTS "Users can view own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can create shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can update own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can delete own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can view all shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can create shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can update all shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can delete all shortlinks" ON shortlinks;

-- Users can view own shortlinks
CREATE POLICY "Users can view own shortlinks"
  ON shortlinks FOR SELECT
  USING (user_id::text = current_setting('app.user_id', true));

-- Admins can view all shortlinks
CREATE POLICY "Admins can view all shortlinks"
  ON shortlinks FOR SELECT
  USING (current_setting('app.user_role', true) = 'admin');

-- Users can create shortlinks
CREATE POLICY "Users can create shortlinks"
  ON shortlinks FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.user_id', true));

-- Admins can create shortlinks
CREATE POLICY "Admins can create shortlinks"
  ON shortlinks FOR INSERT
  WITH CHECK (current_setting('app.user_role', true) = 'admin');

-- Users can update own shortlinks
CREATE POLICY "Users can update own shortlinks"
  ON shortlinks FOR UPDATE
  USING (user_id::text = current_setting('app.user_id', true))
  WITH CHECK (user_id::text = current_setting('app.user_id', true));

-- Admins can update all shortlinks
CREATE POLICY "Admins can update all shortlinks"
  ON shortlinks FOR UPDATE
  USING (current_setting('app.user_role', true) = 'admin')
  WITH CHECK (current_setting('app.user_role', true) = 'admin');

-- Users can delete own shortlinks
CREATE POLICY "Users can delete own shortlinks"
  ON shortlinks FOR DELETE
  USING (user_id::text = current_setting('app.user_id', true));

-- Admins can delete all shortlinks
CREATE POLICY "Admins can delete all shortlinks"
  ON shortlinks FOR DELETE
  USING (current_setting('app.user_role', true) = 'admin');
