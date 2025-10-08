-- Update all project media URLs to use picsum.photos
-- This provides real JPEG images that React Native can decode properly
UPDATE public.project_media
SET uri = 'https://picsum.photos/seed/' || id || '/400/250';
