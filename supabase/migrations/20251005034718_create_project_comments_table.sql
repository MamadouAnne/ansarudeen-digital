-- Create project_comments table
CREATE TABLE IF NOT EXISTS public.project_comments (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_created_at ON public.project_comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Project comments are viewable by everyone"
    ON public.project_comments
    FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert project comments"
    ON public.project_comments
    FOR INSERT
    WITH CHECK (true);

-- Create trigger to auto-update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.project_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
