-- Add featured column to projects table
ALTER TABLE public.projects
ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Add featured column to events table
ALTER TABLE public.events
ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Add index for faster queries on featured items
CREATE INDEX idx_projects_featured ON public.projects(featured) WHERE featured = true;
CREATE INDEX idx_events_featured ON public.events(featured) WHERE featured = true;
