-- Create storage bucket for marketplace images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketplace-images',
  'marketplace-images',
  true,
  5242880, -- 5MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Note: Storage RLS policies should be created via Supabase Dashboard
-- Go to Storage > marketplace-images > Policies
-- Or use the Supabase CLI with service role key

-- The following policies need to be created:
-- 1. SELECT policy for public read access
-- 2. INSERT policy for authenticated users
-- 3. UPDATE policy for owners only
-- 4. DELETE policy for owners only
