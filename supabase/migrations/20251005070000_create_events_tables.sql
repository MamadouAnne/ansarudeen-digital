-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    title_arabic TEXT NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    location_arabic TEXT NOT NULL,
    address TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Fundraising', 'Education', 'Religious', 'Healthcare', 'Environment')),
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    attendees INTEGER NOT NULL DEFAULT 0,
    capacity INTEGER NOT NULL,
    price TEXT NOT NULL DEFAULT 'Free',
    organizer TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create event_media table for storing event images
CREATE TABLE IF NOT EXISTS public.event_media (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    uri TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create event_registrations table to track user registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    UNIQUE(event_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_event_media_event_id ON public.event_media(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for events (read access for everyone)
CREATE POLICY "Events are viewable by everyone"
    ON public.events
    FOR SELECT
    USING (true);

CREATE POLICY "Event media is viewable by everyone"
    ON public.event_media
    FOR SELECT
    USING (true);

-- Policies for event registrations
CREATE POLICY "Users can view their own registrations"
    ON public.event_registrations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
    ON public.event_registrations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
    ON public.event_registrations
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registrations"
    ON public.event_registrations
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Admin policies for events management
CREATE POLICY "Authenticated users can insert events"
    ON public.events
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
    ON public.events
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete events"
    ON public.events
    FOR DELETE
    TO authenticated
    USING (true);

-- Admin policies for event media
CREATE POLICY "Authenticated users can insert event media"
    ON public.event_media
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update event media"
    ON public.event_media
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete event media"
    ON public.event_media
    FOR DELETE
    TO authenticated
    USING (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on events table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Function to update attendee count based on registrations
CREATE OR REPLACE FUNCTION public.update_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'registered' THEN
        UPDATE public.events
        SET attendees = attendees + 1
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'registered' AND NEW.status != 'registered' THEN
        UPDATE public.events
        SET attendees = attendees - 1
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'registered' AND NEW.status = 'registered' THEN
        UPDATE public.events
        SET attendees = attendees + 1
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'registered' THEN
        UPDATE public.events
        SET attendees = attendees - 1
        WHERE id = OLD.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update attendee count
CREATE TRIGGER update_event_attendees_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_event_attendees();
