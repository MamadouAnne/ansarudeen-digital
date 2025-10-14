-- Drop user_profiles table since we already have profiles table
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Add role column to existing profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add check constraint for valid roles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_role'
        AND conrelid = 'public.profiles'::regclass
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT check_role CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- Create index on role for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Add comment
COMMENT ON COLUMN public.profiles.role IS 'User role: user or admin';

-- Update the trigger function to use profiles instead of user_profiles
CREATE OR REPLACE FUNCTION public.create_admin_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if profile already exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
        INSERT INTO public.profiles (user_id, role)
        VALUES (
            NEW.id,
            CASE
                WHEN NEW.email = 'mamadiankha@gmail.com' THEN 'admin'
                ELSE 'user'
            END
        );
    ELSE
        -- Update existing profile with admin role if it's the admin email
        IF NEW.email = 'mamadiankha@gmail.com' THEN
            UPDATE public.profiles
            SET role = 'admin'
            WHERE user_id = NEW.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate admin policies for messages table to use profiles
DROP POLICY IF EXISTS "Admins can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON public.messages;

CREATE POLICY "Admins can insert messages"
    ON public.messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update messages"
    ON public.messages
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete messages"
    ON public.messages
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Set admin role for existing admin user if they have a profile
UPDATE public.profiles
SET role = 'admin'
WHERE user_id IN (
    SELECT id FROM auth.users
    WHERE email = 'mamadiankha@gmail.com'
);
