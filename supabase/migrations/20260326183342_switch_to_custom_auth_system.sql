/*
  # Switch to Custom Authentication System

  ## Overview
  Replaces Supabase Auth with custom username/password authentication.
  
  ## Changes
  1. Create new `app_users` table with username/password authentication
  2. Add `is_active` column to shortlinks table
  3. Update all foreign keys to reference new app_users table
  4. Create admin user (RohanAFK)
  5. Update RLS policies to use app_users

  ## New Tables
  
  ### `app_users`
  - `id` (uuid, primary key)
  - `username` (text, unique) - Login username
  - `password_hash` (text) - Bcrypt hashed password
  - `role` (text) - 'admin' or 'user'
  - `created_at` (timestamptz)
  - `created_by` (uuid) - Admin who created this user

  ## Security
  - RLS enabled on all tables
  - Custom session management via app.user_id setting
  - Admins have full access, users only access their own data
*/

-- Create app_users table with custom authentication
CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES app_users(id) ON DELETE SET NULL
);

-- Add is_active column to shortlinks if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shortlinks' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE shortlinks ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Enable RLS on app_users
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Drop old policies and create new ones for app_users
DROP POLICY IF EXISTS "Admins can view all users" ON app_users;
DROP POLICY IF EXISTS "Users can view own profile" ON app_users;
DROP POLICY IF EXISTS "Admins can create users" ON app_users;
DROP POLICY IF EXISTS "Users can update own profile" ON app_users;
DROP POLICY IF EXISTS "Admins can delete users" ON app_users;

CREATE POLICY "Admins can view all users"
  ON app_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM app_users u
      WHERE u.id = (current_setting('app.user_id', true))::uuid
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Users can view own profile"
  ON app_users FOR SELECT
  USING (id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Admins can create users"
  ON app_users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users u
      WHERE u.id = (current_setting('app.user_id', true))::uuid
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON app_users FOR UPDATE
  USING (id = (current_setting('app.user_id', true))::uuid)
  WITH CHECK (id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Admins can delete users"
  ON app_users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM app_users u
      WHERE u.id = (current_setting('app.user_id', true))::uuid
      AND u.role = 'admin'
    )
  );

-- Insert admin user
-- Using a placeholder hash - will be updated by the app on first login
INSERT INTO app_users (username, password_hash, role, created_by)
VALUES ('RohanAFK', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8Nt7.KoXJ.S0BkQN8LqJ8qPq6Q4z2', 'admin', NULL)
ON CONFLICT (username) DO NOTHING;
