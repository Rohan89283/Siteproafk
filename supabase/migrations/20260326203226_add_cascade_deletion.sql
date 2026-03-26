/*
  # Add Cascade Deletion

  1. Changes
    - Drop existing foreign key constraint on click_analytics
    - Recreate with ON DELETE CASCADE
    - This ensures when a shortlink is deleted, all its analytics are deleted too
    
  2. Security
    - Maintains referential integrity
    - Automatically cleans up related data
*/

-- Drop existing foreign key if it exists
ALTER TABLE click_analytics 
DROP CONSTRAINT IF EXISTS click_analytics_shortlink_id_fkey;

-- Add foreign key with CASCADE delete
ALTER TABLE click_analytics
ADD CONSTRAINT click_analytics_shortlink_id_fkey 
FOREIGN KEY (shortlink_id) 
REFERENCES shortlinks(id) 
ON DELETE CASCADE;
