-- Create enum types for message categories and priorities
CREATE TYPE message_category AS ENUM ('announcement', 'reminder', 'event', 'update');
CREATE TYPE message_priority AS ENUM ('high', 'normal', 'low');

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category message_category NOT NULL DEFAULT 'announcement',
    priority message_priority NOT NULL DEFAULT 'normal',
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL DEFAULT 'Administrator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    is_published BOOLEAN NOT NULL DEFAULT true
);

-- Create message_reads table to track which users have read which messages
CREATE TABLE IF NOT EXISTS public.message_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_category ON public.messages(category);
CREATE INDEX IF NOT EXISTS idx_messages_priority ON public.messages(priority);
CREATE INDEX IF NOT EXISTS idx_messages_published ON public.messages(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON public.message_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_message_id ON public.message_reads(message_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;

-- Create policies for messages table
-- All authenticated users can read published messages
CREATE POLICY "Users can read published messages"
    ON public.messages
    FOR SELECT
    TO authenticated
    USING (is_published = true);

-- Only admins can insert messages (requires user_profiles table with role column)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        CREATE POLICY "Admins can insert messages"
            ON public.messages
            FOR INSERT
            TO authenticated
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.user_profiles
                    WHERE user_profiles.id = auth.uid()
                    AND user_profiles.role = 'admin'
                )
            );

        -- Only admins can update messages
        CREATE POLICY "Admins can update messages"
            ON public.messages
            FOR UPDATE
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_profiles
                    WHERE user_profiles.id = auth.uid()
                    AND user_profiles.role = 'admin'
                )
            );

        -- Only admins can delete messages
        CREATE POLICY "Admins can delete messages"
            ON public.messages
            FOR DELETE
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_profiles
                    WHERE user_profiles.id = auth.uid()
                    AND user_profiles.role = 'admin'
                )
            );
    ELSE
        RAISE NOTICE 'user_profiles table does not exist, skipping admin policies. Please create user_profiles table with role column.';
    END IF;
END $$;

-- Create policies for message_reads table
-- Users can read their own message read status
CREATE POLICY "Users can read their own message reads"
    ON public.message_reads
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Users can mark messages as read
CREATE POLICY "Users can mark messages as read"
    ON public.message_reads
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Users can update their own message read status
CREATE POLICY "Users can update their own message reads"
    ON public.message_reads
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Create a function to get messages with read status for a user
CREATE OR REPLACE FUNCTION public.get_user_messages(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    category message_category,
    priority message_priority,
    sender_name TEXT,
    sender_role TEXT,
    created_at TIMESTAMPTZ,
    is_read BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.title,
        m.content,
        m.category,
        m.priority,
        m.sender_name,
        m.sender_role,
        m.created_at,
        CASE WHEN mr.id IS NOT NULL THEN true ELSE false END as is_read
    FROM public.messages m
    LEFT JOIN public.message_reads mr ON m.id = mr.message_id AND mr.user_id = user_uuid
    WHERE m.is_published = true
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_messages(UUID) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.messages IS 'Stores admin messages/announcements for the Ansarudeen community';
COMMENT ON TABLE public.message_reads IS 'Tracks which users have read which messages';
COMMENT ON COLUMN public.messages.is_published IS 'Whether the message is published and visible to users';
COMMENT ON COLUMN public.messages.published_at IS 'When the message was published';
COMMENT ON FUNCTION public.get_user_messages IS 'Returns all published messages with read status for a specific user';
