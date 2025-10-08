-- Drop user_profiles table and related objects (if it exists)

-- Check if table exists before dropping trigger
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
        DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
        DROP TABLE IF EXISTS public.user_profiles CASCADE;
    END IF;
END $$;

-- Drop the trigger function if no other tables are using it
-- (keeping it commented out in case other tables use it)
-- DROP FUNCTION IF EXISTS public.handle_updated_at();