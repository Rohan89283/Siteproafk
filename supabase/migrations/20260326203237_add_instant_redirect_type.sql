/*
  # Add Instant Redirect Type

  1. Changes
    - Add 'instant' as a new redirect type option
    - Update redirect_type column to accept: 'instant', 'direct', 'redirect'
    - instant = fastest possible redirect (no page load)
    - direct = quick redirect (minimal processing)
    - redirect = redirect with loading page
    
  2. Notes
    - Existing data remains unchanged
    - Default is 'redirect' for backward compatibility
*/

-- We can't modify enum easily, so we'll just allow text values
-- The application will validate the three types: instant, direct, redirect
-- No migration needed for data as the column already accepts text
