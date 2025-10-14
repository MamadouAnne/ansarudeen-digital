-- Add event_id field to messages table for sharing events
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS event_id INTEGER REFERENCES public.events(id) ON DELETE CASCADE;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_event_id ON public.messages(event_id);

-- Add comment
COMMENT ON COLUMN public.messages.event_id IS 'Reference to an event when the message is a shared event card';
