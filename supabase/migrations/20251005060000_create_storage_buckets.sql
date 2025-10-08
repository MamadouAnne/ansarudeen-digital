-- Create storage buckets for project and news media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('project-media', 'project-media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('news-media', 'news-media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Note: RLS is already enabled by default on storage.objects table
-- The following policies control access to the storage buckets

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public read access for project-media" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for news-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to project-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to news-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files in project-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files in news-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files in project-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files in news-media" ON storage.objects;

-- Policy: Public read access for project-media bucket
CREATE POLICY "Public read access for project-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-media');

-- Policy: Public read access for news-media bucket
CREATE POLICY "Public read access for news-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-media');

-- Policy: Authenticated users can upload to project-media
CREATE POLICY "Authenticated users can upload to project-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-media');

-- Policy: Authenticated users can upload to news-media
CREATE POLICY "Authenticated users can upload to news-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-media');

-- Policy: Authenticated users can update files in project-media
CREATE POLICY "Authenticated users can update files in project-media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-media');

-- Policy: Authenticated users can update files in news-media
CREATE POLICY "Authenticated users can update files in news-media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-media');

-- Policy: Authenticated users can delete files in project-media
CREATE POLICY "Authenticated users can delete files in project-media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-media');

-- Policy: Authenticated users can delete files in news-media
CREATE POLICY "Authenticated users can delete files in news-media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-media');
