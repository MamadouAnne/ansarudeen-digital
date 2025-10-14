-- Add project_id field to messages table for sharing projects
ALTER TABLE public.messages
ADD COLUMN project_id INTEGER REFERENCES public.projects(id) ON DELETE CASCADE;

-- Add index for faster queries
CREATE INDEX idx_messages_project_id ON public.messages(project_id);

-- Add comment
COMMENT ON COLUMN public.messages.project_id IS 'Reference to a project when the message is a shared project card';
