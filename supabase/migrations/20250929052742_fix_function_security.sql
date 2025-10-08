-- Fix security warning for handle_updated_at function
-- Set secure search_path to prevent search_path hijacking attacks

-- Drop the existing function (CASCADE to drop dependent triggers)
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Recreate with secure search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add comment explaining the security fix
COMMENT ON FUNCTION public.handle_updated_at() IS 'Secure trigger function with empty search_path to prevent search_path hijacking attacks';