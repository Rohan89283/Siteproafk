/*
  # Add Increment Clicks Function

  1. New Functions
    - `increment_shortlink_clicks`: Atomic increment function for click counts
    
  2. Purpose
    - Provides atomic, fast click count incrementing
    - Avoids race conditions
    - Improves redirect speed by removing read-then-write pattern
    
  3. Security
    - Public function (anyone can increment clicks for redirects)
    - Only updates click_count field
*/

-- Create function to atomically increment click count
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

-- Grant execute permission to public (needed for redirects)
GRANT EXECUTE ON FUNCTION increment_shortlink_clicks(uuid) TO anon, authenticated;
