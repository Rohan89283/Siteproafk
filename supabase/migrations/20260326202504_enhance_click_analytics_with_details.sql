/*
  # Enhanced Click Analytics with Detailed Tracking

  1. Changes
    - Add detailed tracking fields to click_analytics table:
      - country (text) - User's country
      - city (text) - User's city
      - region (text) - User's region/state
      - ip_address (text) - User's IP address
      - user_agent (text) - Full user agent string
      - referrer (text) - Referring URL
      - language (text) - Browser language
      - screen_resolution (text) - Screen resolution
      - timestamp (timestamptz) - Click timestamp with timezone
    
  2. Notes
    - These fields enable detailed analytics and insights
    - All fields are optional to maintain backward compatibility
    - IP addresses stored for analytics only (consider privacy policies)
*/

-- Add new analytics fields to click_analytics table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'country'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN country text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'city'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'region'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN region text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN ip_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN user_agent text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'referrer'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN referrer text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'language'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN language text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'screen_resolution'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN screen_resolution text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'click_analytics' AND column_name = 'timestamp'
  ) THEN
    ALTER TABLE click_analytics ADD COLUMN timestamp timestamptz DEFAULT now();
  END IF;
END $$;
