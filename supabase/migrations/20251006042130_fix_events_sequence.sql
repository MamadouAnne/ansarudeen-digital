-- Fix the events table primary key sequence
-- This resets the sequence to start from the next available ID

SELECT setval(
  pg_get_serial_sequence('public.events', 'id'),
  COALESCE((SELECT MAX(id) FROM public.events), 0) + 1,
  false
);
