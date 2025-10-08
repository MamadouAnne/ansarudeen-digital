-- Add likes column to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;

-- Add UPDATE policy for projects to allow updating likes
CREATE POLICY "Anyone can update likes on projects"
    ON public.projects
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
