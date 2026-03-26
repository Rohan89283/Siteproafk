/*
  # User Context RPC Functions

  ## Overview
  Creates PostgreSQL functions to manage user context for RLS policies.

  ## Functions
  
  ### `set_user_context(user_id uuid)`
  Sets the current user ID in the PostgreSQL session for RLS policy evaluation.
  
  ### `unset_user_context()`
  Clears the user context from the session.

  ## Usage
  These functions are called from the application layer to establish user identity
  for Row Level Security policies without using Supabase Auth.
*/

-- Function to set user context
CREATE OR REPLACE FUNCTION set_user_context(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.user_id', user_id::text, false);
END;
$$;

-- Function to unset user context
CREATE OR REPLACE FUNCTION unset_user_context()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.user_id', '', false);
END;
$$;
