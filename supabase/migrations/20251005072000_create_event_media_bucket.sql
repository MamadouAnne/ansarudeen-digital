-- Create storage bucket for event media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('event-media', 'event-media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for event-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to event-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files in event-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files in event-media" ON storage.objects;

-- Policy: Public read access for event-media bucket
CREATE POLICY "Public read access for event-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-media');

-- Policy: Authenticated users can upload to event-media
CREATE POLICY "Authenticated users can upload to event-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-media');

-- Policy: Authenticated users can update files in event-media
CREATE POLICY "Authenticated users can update files in event-media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-media');

-- Policy: Authenticated users can delete files in event-media
CREATE POLICY "Authenticated users can delete files in event-media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-media');
