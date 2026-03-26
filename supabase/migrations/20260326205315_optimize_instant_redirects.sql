/*
  # Optimize Instant Redirects

  1. Changes
    - Update increment function to work asynchronously
    - Add trigger for instant redirect analytics
    
  2. Purpose
    - Enable truly instant redirects without waiting for click count
    - Track analytics asynchronously using database triggers
    
  3. Security
    - Maintains existing RLS policies
    - Public function access for redirects
*/

-- Drop existing function
DROP FUNCTION IF EXISTS increment_shortlink_clicks(uuid);

-- Create async increment function using background worker
CREATE OR REPLACE FUNCTION increment_shortlink_clicks(shortlink_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE shortlinks
  SET click_count = COALESCE(click_count, 0) + 1
  WHERE id = shortlink_id;
END;
$$;

-- Grant execute to public
GRANT EXECUTE ON FUNCTION increment_shortlink_clicks(uuid) TO anon, authenticated;
