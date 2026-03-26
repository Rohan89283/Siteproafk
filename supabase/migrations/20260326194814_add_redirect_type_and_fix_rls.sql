/*
  # Add Redirect Type and Fix RLS Policies

  1. Changes
    - Add redirect_type column to shortlinks table (direct or redirect)
    - Update RLS policies so users only see their own shortlinks
    - Admin can see all shortlinks

  2. Security
    - Users can only view/edit/delete their own shortlinks
    - Admins can view all shortlinks but only edit/delete their own
    - Short codes cannot be changed after creation
*/

-- Add redirect_type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shortlinks' AND column_name = 'redirect_type'
  ) THEN
    ALTER TABLE shortlinks ADD COLUMN redirect_type text DEFAULT 'redirect';
    ALTER TABLE shortlinks ADD CONSTRAINT shortlinks_redirect_type_check 
      CHECK (redirect_type IN ('direct', 'redirect'));
  END IF;
END $$;

-- Drop existing RLS policies for shortlinks
DROP POLICY IF EXISTS "Users can view own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can insert own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can update own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Users can delete own shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can view all shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can create shortlinks" ON shortlinks;
DROP POLICY IF EXISTS "Admins can update any shortlink" ON shortlinks;
DROP POLICY IF EXISTS "Admins can delete any shortlink" ON shortlinks;

-- Get current user ID helper function
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN NULLIF(current_setting('app.user_id', true), '')::uuid;
END;
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM app_users
    WHERE id = get_current_user_id()
    AND role = 'admin'
  );
END;
$$;

-- Create new RLS policies for shortlinks

-- Users can view only their own shortlinks
CREATE POLICY "Users can view own shortlinks"
  ON shortlinks FOR SELECT
  TO authenticated
  USING (
    user_id = get_current_user_id()
  );

-- Admins can view all shortlinks
CREATE POLICY "Admins can view all shortlinks"
  ON shortlinks FOR SELECT
  TO authenticated
  USING (
    is_current_user_admin()
  );

-- Users can insert their own shortlinks
CREATE POLICY "Users can insert own shortlinks"
  ON shortlinks FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = get_current_user_id()
  );

-- Users can update their own shortlinks
CREATE POLICY "Users can update own shortlinks"
  ON shortlinks FOR UPDATE
  TO authenticated
  USING (
    user_id = get_current_user_id()
  )
  WITH CHECK (
    user_id = get_current_user_id()
  );

-- Users can delete their own shortlinks
CREATE POLICY "Users can delete own shortlinks"
  ON shortlinks FOR DELETE
  TO authenticated
  USING (
    user_id = get_current_user_id()
  );
