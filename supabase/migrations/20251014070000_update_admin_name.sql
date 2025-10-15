-- Update all messages with 'Ansarudeen Admin' sender name to 'Admin'
UPDATE public.messages
SET sender_name = 'Admin'
WHERE sender_name = 'Ansarudeen Admin';

-- Log the update
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO updated_count FROM public.messages WHERE sender_name = 'Admin';
    RAISE NOTICE 'Successfully updated sender names. Total messages with "Admin": %', updated_count;
END $$;
