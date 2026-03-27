/*
  # Fix increment_shortlink_clicks function security

  1. Changes
    - Drop and recreate increment_shortlink_clicks function with SECURITY DEFINER
    - This allows the function to bypass RLS when incrementing click counts
    - Ensures public edge functions can update click counts without authentication

  2. Security
    - Function uses SECURITY DEFINER to bypass RLS safely
    - Only updates click_count field, no other modifications possible
    - Input validation on shortlink_id parameter
*/

DROP FUNCTION IF EXISTS increment_shortlink_clicks(uuid);

CREATE OR REPLACE FUNCTION increment_shortlink_clicks(shortlink_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE shortlinks
  SET click_count = COALESCE(click_count, 0) + 1
  WHERE id = shortlink_id AND is_active = true;
END;
$$;
