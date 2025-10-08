-- Update placeholder URLs to use placehold.co instead of via.placeholder.com
UPDATE public.project_media
SET uri = REPLACE(uri, 'via.placeholder.com', 'placehold.co')
WHERE uri LIKE '%via.placeholder.com%';
