/*
  # Fix Shortlists RLS Policies

  1. Changes
    - Drop existing shortlists policies
    - Create new policies using session-based user context
    - Users can view, create, update, and delete their own shortlists
    - Admins can view all shortlists

  2. Security
    - Uses session settings (app.user_id and app.user_role) set by backend
    - No recursive queries
*/

-- Drop all existing policies on shortlists
DROP POLICY IF EXISTS "Users can view own shortlists" ON shortlists;
DROP POLICY IF EXISTS "Users can create shortlists" ON shortlists;
DROP POLICY IF EXISTS "Users can update own shortlists" ON shortlists;
DROP POLICY IF EXISTS "Users can delete own shortlists" ON shortlists;
DROP POLICY IF EXISTS "Admins can view all shortlists" ON shortlists;

-- Create new non-recursive policies
CREATE POLICY "Users can view own shortlists"
  ON shortlists FOR SELECT
  USING (user_id::text = current_setting('app.user_id', true));

CREATE POLICY "Admins can view all shortlists"
  ON shortlists FOR SELECT
  USING (current_setting('app.user_role', true) = 'admin');

CREATE POLICY "Users can create shortlists"
  ON shortlists FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.user_id', true));

CREATE POLICY "Users can update own shortlists"
  ON shortlists FOR UPDATE
  USING (user_id::text = current_setting('app.user_id', true))
  WITH CHECK (user_id::text = current_setting('app.user_id', true));

CREATE POLICY "Users can delete own shortlists"
  ON shortlists FOR DELETE
  USING (user_id::text = current_setting('app.user_id', true));
