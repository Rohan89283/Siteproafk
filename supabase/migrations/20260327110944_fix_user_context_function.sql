/*
  # Fix User Context Function

  1. Updates
    - Drop existing set_user_context function
    - Create new set_user_context function that accepts both user_id and user_role
    - Sets both app.user_id and app.user_role configuration parameters

  2. Purpose
    - Allow RLS policies to check both user ID and role
    - Enable proper authentication context for shortlink creation
*/

DROP FUNCTION IF EXISTS set_user_context(uuid);

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
