-- Migration to update marketplace_items table from single image to multiple images
-- This handles the transition from 'image' (TEXT) to 'images' (TEXT[])

-- Check if the old 'image' column exists, and if so, migrate data
DO $$
BEGIN
  -- Check if 'image' column exists and 'images' doesn't
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'marketplace_items' AND column_name = 'image'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'marketplace_items' AND column_name = 'images'
  ) THEN

    -- Add new 'images' column as array
    ALTER TABLE marketplace_items
    ADD COLUMN images TEXT[] DEFAULT '{}';

    -- Migrate existing data: convert single image to array
    UPDATE marketplace_items
    SET images = ARRAY[image]
    WHERE image IS NOT NULL AND image != '';

    -- Drop old 'image' column
    ALTER TABLE marketplace_items
    DROP COLUMN image;

    -- Make images column NOT NULL with default
    ALTER TABLE marketplace_items
    ALTER COLUMN images SET NOT NULL,
    ALTER COLUMN images SET DEFAULT '{}';

    RAISE NOTICE 'Successfully migrated image column to images array';

  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'marketplace_items' AND column_name = 'images'
  ) THEN

    -- If neither exists, just add the images column
    ALTER TABLE marketplace_items
    ADD COLUMN images TEXT[] NOT NULL DEFAULT '{}';

    RAISE NOTICE 'Added images column';

  ELSE
    RAISE NOTICE 'images column already exists, skipping migration';
  END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
