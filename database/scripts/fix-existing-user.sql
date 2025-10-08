-- Script to create profile for existing user
-- Run this AFTER the setup script

-- Check existing users first
SELECT 'Existing users:' as info;
SELECT id, email, created_at FROM auth.users;

-- Create profile for the existing user we see in logs
INSERT INTO profiles (
  user_id,
  first_name,
  last_name,
  email,
  membership_id,
  member_since,
  membership_status,
  membership_type
)
SELECT
  id,
  'User',
  'Profile',
  email,
  'AD' || EXTRACT(EPOCH FROM created_at)::bigint,
  created_at::date,
  'Active',
  'Full Member'
FROM auth.users
WHERE id::text = 'b020a8df-2124-4217-ba31-b7ec448e737c'
ON CONFLICT (user_id) DO NOTHING;

-- Show created profiles
SELECT 'Profiles created:' as info;
SELECT membership_id, first_name, last_name, email, membership_status FROM profiles;