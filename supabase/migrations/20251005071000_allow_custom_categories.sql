-- Remove the CHECK constraint on category to allow custom categories
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_category_check;

-- Category is now a free text field, allowing any custom category
-- The database will accept any category value, making it flexible for future use
