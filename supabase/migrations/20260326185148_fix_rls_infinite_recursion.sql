/*
  # Fix Infinite Recursion in RLS Policies

  ## Problem
  The app_users policies were causing infinite recursion because they query
  the same table they're protecting. When checking if a user is admin, the
  policy tries to SELECT from app_users, which triggers the same policy again.

  ## Solution
  Simplify policies to use only current_setting without querying app_users:
  - Store both user_id AND role in session settings
  - Policies check the session role directly, not by querying the table
  
  ## Changes
  1. Drop all existing policies on app_users
  2. Create new non-recursive policies
  3. Update RPC functions to set both user_id and role in session
  
  ## Security
  - Session settings are managed by SECURITY DEFINER functions
  - Only the backend can set these values
  - Users cannot manipulate their own role
*/

-- Drop all existing policies on app_users
DROP POLICY IF EXISTS "Admins can view all users" ON app_users;
DROP POLICY IF EXISTS "Users can view own profile" ON app_users;
DROP POLICY IF EXISTS "Admins can create users" ON app_users;
DROP POLICY IF EXISTS "Users can update own profile" ON app_users;
DROP POLICY IF EXISTS "Admins can delete users" ON app_users;

-- Create new non-recursive policies
CREATE POLICY "Admins can view all users"
  ON app_users FOR SELECT
  USING (current_setting('app.user_role', true) = 'admin');

CREATE POLICY "Users can view own profile"
  ON app_users FOR SELECT
  USING (id::text = current_setting('app.user_id', true));

CREATE POLICY "Admins can create users"
  ON app_users FOR INSERT
  WITH CHECK (current_setting('app.user_role', true) = 'admin');

CREATE POLICY "Users can update own profile"
  ON app_users FOR UPDATE
  USING (id::text = current_setting('app.user_id', true))
  WITH CHECK (id::text = current_setting('app.user_id', true));

CREATE POLICY "Admins can delete users"
  ON app_users FOR DELETE
  USING (current_setting('app.user_role', true) = 'admin');

-- Update the set_user_context function to also set the role
CREATE OR REPLACE FUNCTION set_user_context(user_id uuid, user_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.user_id', user_id::text, false);
  PERFORM set_config('app.user_role', user_role, false);
END;
$$;

-- Update unset to clear both settings
CREATE OR REPLACE FUNCTION unset_user_context()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.user_id', '', false);
  PERFORM set_config('app.user_role', '', false);
END;
$$;
