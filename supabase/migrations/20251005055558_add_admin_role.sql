-- Add role column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add check constraint for valid roles
ALTER TABLE public.profiles
ADD CONSTRAINT check_role CHECK (role IN ('user', 'admin'));

-- Update specific user to admin role
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'mamadiankha@gmail.com';

-- Create index on role for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Add comment
COMMENT ON COLUMN public.profiles.role IS 'User role: user or admin';
