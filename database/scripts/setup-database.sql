
-- Ansarudeen Digital Database Setup Script
-- Run this script in your Supabase SQL Editor

-- Drop existing tables if they exist (optional - remove these lines if you want to keep existing data)
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_total_donations() CASCADE;

-- Create profiles table for user data
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  membership_id VARCHAR(20) UNIQUE NOT NULL,
  member_since DATE NOT NULL DEFAULT CURRENT_DATE,
  total_donations DECIMAL(10,2) DEFAULT 0.00,
  membership_status VARCHAR(20) DEFAULT 'Active' CHECK (membership_status IN ('Active', 'Inactive', 'Pending')),
  membership_type VARCHAR(20) DEFAULT 'Full Member' CHECK (membership_type IN ('Full Member', 'Associate Member', 'Honorary Member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Create donations table for tracking donations
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  donation_type VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for donations table
CREATE POLICY "Users can view own donations" ON donations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own donations" ON donations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function to update total_donations
CREATE OR REPLACE FUNCTION update_total_donations()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET total_donations = (
    SELECT COALESCE(SUM(amount), 0)
    FROM donations
    WHERE user_id = NEW.user_id
  )
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update total_donations when new donation is added
CREATE TRIGGER update_total_donations_trigger
  AFTER INSERT ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_total_donations();

-- CRITICAL: Function to create a profile for a new user automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  membership_id_new TEXT;
  profile_exists INTEGER;
BEGIN
  -- Check if profile already exists for this user
  SELECT COUNT(*) INTO profile_exists 
  FROM public.profiles 
  WHERE user_id = NEW.id;
  
  -- Only create profile if it doesn't already exist
  IF profile_exists = 0 THEN
    -- Generate a unique membership ID
    membership_id_new := 'AD' || (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;

    -- Insert into public.profiles with default values for required fields
    INSERT INTO public.profiles (user_id, first_name, last_name, email, phone, membership_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
      COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      membership_id_new
    );
    RAISE NOTICE 'Profile created successfully for user %', NEW.id;
  ELSE
    RAISE NOTICE 'Profile already exists for user %, skipping creation', NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN unique_violation THEN
  -- Handle race condition where profile was created by another process
  RAISE NOTICE 'Profile creation skipped - already exists for user %', NEW.id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log other errors but don't fail the user creation
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CRITICAL: Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_membership_id ON profiles(membership_id);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_created_at ON donations(created_at);

-- Insert sample data for testing (optional)
-- You can remove this section if you don't want sample data

-- Note: You'll need to replace these UUIDs with actual user IDs from your auth.users table
-- To get existing user IDs, run: SELECT id, email FROM auth.users;

-- Example sample profile (replace the UUID with an actual user ID)
-- INSERT INTO profiles (
--   user_id,
--   first_name,
--   last_name,
--   email,
--   phone,
--   membership_id,
--   member_since,
--   membership_status,
--   membership_type
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
--   'John',
--   'Doe',
--   'john.doe@example.com',
--   '+1234567890',
--   'AD' || extract(epoch from now()),
--   CURRENT_DATE,
--   'Active',
--   'Full Member'
-- );

-- Grant necessary permissions (run if needed)
-- GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- GRANT ALL ON profiles TO authenticated;
-- GRANT ALL ON donations TO authenticated;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON donations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Verify the setup
SELECT 'Profiles table created successfully' as status
UNION ALL
SELECT 'Donations table created successfully' as status
UNION ALL
SELECT 'RLS policies created successfully' as status
UNION ALL
SELECT 'Triggers and functions created successfully' as status
UNION ALL
SELECT 'User creation trigger created successfully' as status;

-- Check if any users exist
SELECT COUNT(*) as user_count FROM auth.users;

-- Show trigger information
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_condition
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created'
AND event_object_table = 'users'
AND trigger_schema = 'auth';

-- Show table structure (alternative to \d command)
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;