-- Reset all event attendee counts to match actual registrations
UPDATE public.events
SET attendees = (
    SELECT COUNT(*)
    FROM public.event_registrations
    WHERE event_registrations.event_id = events.id
    AND event_registrations.status = 'registered'
);
