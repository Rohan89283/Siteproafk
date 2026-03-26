/*
  # Update Redirect Type Constraint

  1. Changes
    - Drop old constraint that only allows 'direct' and 'redirect'
    - Add new constraint allowing 'instant', 'direct', and 'redirect'
    
  2. Notes
    - This fixes the constraint violation error
    - Allows all three redirect types to be used
*/

-- Drop old constraint
ALTER TABLE shortlinks DROP CONSTRAINT IF EXISTS shortlinks_redirect_type_check;

-- Add new constraint with all three types
ALTER TABLE shortlinks 
ADD CONSTRAINT shortlinks_redirect_type_check 
CHECK (redirect_type = ANY (ARRAY['instant'::text, 'direct'::text, 'redirect'::text]));
