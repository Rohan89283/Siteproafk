/*
  # Fix Shortlists RLS Visibility

  1. Changes
    - Drop and recreate shortlists RLS policies
    - Users can only see their own shortlists
    - Admins can see all shortlists
    
  2. Security
    - Ensure proper data isolation between users
    - Admins have full visibility for management
*/

-- Drop all existing shortlists policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own shortlists" ON shortlists;
  DROP POLICY IF EXISTS "Admins can view all shortlists" ON shortlists;
  DROP POLICY IF EXISTS "Users can insert own shortlists" ON shortlists;
  DROP POLICY IF EXISTS "Users can update own shortlists" ON shortlists;
  DROP POLICY IF EXISTS "Users can delete own shortlists" ON shortlists;
  DROP POLICY IF EXISTS "Admins can manage all shortlists" ON shortlists;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- SELECT policies
CREATE POLICY "Users can view own shortlists"
  ON shortlists
  FOR SELECT
  TO authenticated
  USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Admins can view all shortlists"
  ON shortlists
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE id = current_setting('app.current_user_id')::uuid
      AND role = 'admin'
    )
  );

-- INSERT policies
CREATE POLICY "Users can insert own shortlists"
  ON shortlists
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);

-- UPDATE policies
CREATE POLICY "Users can update own shortlists"
  ON shortlists
  FOR UPDATE
  TO authenticated
  USING (user_id = current_setting('app.current_user_id')::uuid)
  WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Admins can update all shortlists"
  ON shortlists
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE id = current_setting('app.current_user_id')::uuid
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE id = current_setting('app.current_user_id')::uuid
      AND role = 'admin'
    )
  );

-- DELETE policies
CREATE POLICY "Users can delete own shortlists"
  ON shortlists
  FOR DELETE
  TO authenticated
  USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Admins can delete all shortlists"
  ON shortlists
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users
      WHERE id = current_setting('app.current_user_id')::uuid
      AND role = 'admin'
    )
  );
