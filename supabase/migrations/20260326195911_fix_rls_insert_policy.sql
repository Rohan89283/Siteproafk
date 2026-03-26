/*
  # Fix RLS Insert Policy for Shortlinks

  1. Changes
    - Drop and recreate INSERT policy to properly handle new rows
    - Ensure users can insert their own shortlinks
    - Fix function return to handle null cases

  2. Security
    - Users can only insert shortlinks with their own user_id
    - No authentication bypass
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can insert own shortlinks" ON shortlinks;

-- Create new insert policy that works correctly
CREATE POLICY "Users can insert own shortlinks"
  ON shortlinks FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = NULLIF(current_setting('app.user_id', true), '')::uuid
  );
