/*
  # Remove Click Analytics Table

  1. Changes
    - Drop click_analytics table (no longer needed)
    - Keep only simple click count tracking in shortlinks table
    
  2. Purpose
    - Simplify tracking to just click counts
    - Improve redirect performance by removing detailed analytics
    - Reduce database complexity
*/

-- Drop the click_analytics table
DROP TABLE IF EXISTS click_analytics CASCADE;
