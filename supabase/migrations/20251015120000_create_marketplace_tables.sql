-- Create marketplace_categories table
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_arabic TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create marketplace_items table with support for multiple images
CREATE TABLE IF NOT EXISTS marketplace_items (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_arabic TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL REFERENCES marketplace_categories(id),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  seller_phone TEXT NOT NULL,
  seller_whatsapp TEXT,
  images TEXT[] NOT NULL DEFAULT '{}', -- Array of image URLs (up to 6)
  location TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on seller_id for faster queries
CREATE INDEX IF NOT EXISTS idx_marketplace_items_seller_id ON marketplace_items(seller_id);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);

-- Create index on featured items
CREATE INDEX IF NOT EXISTS idx_marketplace_items_featured ON marketplace_items(featured) WHERE featured = TRUE;

-- Enable Row Level Security
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_categories (public read access)
CREATE POLICY "Anyone can view marketplace categories"
  ON marketplace_categories
  FOR SELECT
  USING (true);

-- RLS Policies for marketplace_items (public read, authenticated create/update/delete own)
CREATE POLICY "Anyone can view marketplace items"
  ON marketplace_items
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create marketplace items"
  ON marketplace_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own marketplace items"
  ON marketplace_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own marketplace items"
  ON marketplace_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Insert marketplace categories
INSERT INTO marketplace_categories (id, name, name_arabic, icon, color) VALUES
  ('books', 'Books', 'كتب', '📚', '#8B5CF6'),
  ('clothing', 'Clothing', 'ملابس', '👔', '#3B82F6'),
  ('accessories', 'Accessories', 'إكسسوارات', '📿', '#10B981'),
  ('prayer_items', 'Prayer Items', 'أدوات الصلاة', '🕌', '#F59E0B'),
  ('home_decor', 'Home Decor', 'ديكور المنزل', '🏡', '#EF4444'),
  ('other', 'Other', 'أخرى', '🛍️', '#6B7280')
ON CONFLICT (id) DO NOTHING;
