-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    title_arabic TEXT NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ongoing', 'planning', 'completed')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    budget TEXT NOT NULL,
    target_amount BIGINT NOT NULL,
    raised_amount BIGINT NOT NULL DEFAULT 0,
    start_date TEXT NOT NULL,
    donors INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project_media table for storing project images/videos
CREATE TABLE IF NOT EXISTS public.project_media (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    uri TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON public.project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Create policies (read access for everyone)
CREATE POLICY "Projects are viewable by everyone"
    ON public.projects
    FOR SELECT
    USING (true);

CREATE POLICY "Project media is viewable by everyone"
    ON public.project_media
    FOR SELECT
    USING (true);

-- Create trigger to auto-update updated_at on projects table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
