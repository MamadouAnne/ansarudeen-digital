# Marketplace Setup Guide

Complete guide to set up the marketplace feature with image upload capabilities.

## Prerequisites

- Supabase project created
- Database connection configured in `lib/supabase.ts`
- User authentication working

## Step 1: Create Marketplace Tables

Run the following migrations in order:

```bash
# From project root
cd supabase/migrations
```

### Migration 1: Create Tables (20251015120000_create_marketplace_tables.sql)

This creates:
- `marketplace_categories` table
- `marketplace_items` table with support for multiple images
- Indexes for performance
- RLS policies

**Run in Supabase Dashboard:**
1. Go to SQL Editor
2. Copy contents of `20251015120000_create_marketplace_tables.sql`
3. Click "Run"

## Step 2: Create Storage Bucket

### Migration 2: Create Bucket (20251015130000_create_marketplace_storage.sql)

This creates the `marketplace-images` bucket with:
- 5MB file size limit
- Support for JPEG, JPG, PNG, WebP, GIF
- Public read access

**Run in Supabase Dashboard:**
1. Go to SQL Editor
2. Copy contents of `20251015130000_create_marketplace_storage.sql`
3. Click "Run"

## Step 3: Setup Storage Policies

Storage policies require elevated permissions and must be set up separately.

### Option A: Via Supabase Dashboard (Recommended)

1. Go to **Storage** in Supabase Dashboard
2. Click on **marketplace-images** bucket
3. Click **Policies** tab
4. Create the following policies:

#### Policy 1: Public Read Access
```sql
-- Name: Anyone can view marketplace images
-- Operation: SELECT
-- Target roles: public
-- Policy definition:
bucket_id = 'marketplace-images'
```

#### Policy 2: Authenticated Upload
```sql
-- Name: Authenticated users can upload
-- Operation: INSERT
-- Target roles: authenticated
-- WITH CHECK:
bucket_id = 'marketplace-images' AND auth.uid() IS NOT NULL
```

#### Policy 3: Owner Update
```sql
-- Name: Users can update their own images
-- Operation: UPDATE
-- Target roles: authenticated
-- USING:
bucket_id = 'marketplace-images' AND auth.uid() = owner
-- WITH CHECK:
bucket_id = 'marketplace-images' AND auth.uid() = owner
```

#### Policy 4: Owner Delete
```sql
-- Name: Users can delete their own images
-- Operation: DELETE
-- Target roles: authenticated
-- USING:
bucket_id = 'marketplace-images' AND auth.uid() = owner
```

### Option B: Via SQL Script

If you have the necessary permissions, you can run:

```bash
# In Supabase SQL Editor
# Copy and run: scripts/setup-marketplace-storage-policies.sql
```

## Step 4: Verify Setup

### Check Tables

```sql
-- Check marketplace_categories
SELECT * FROM marketplace_categories;

-- Check marketplace_items structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'marketplace_items';
```

### Check Storage Bucket

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'marketplace-images';

-- Check policies
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%marketplace%';
```

### Test Upload (Optional)

1. Open the app
2. Navigate to Marketplace
3. Click the **+** button
4. Fill out the form
5. Add 1-6 images
6. Click "Add to Marketplace"
7. Check Supabase Storage to see uploaded images

## Troubleshooting

### Issue: "must be owner of table objects" error

**Solution:** Storage policies can't be created in regular migrations. Use Option A (Dashboard) or Option B (SQL script) from Step 3.

### Issue: Images not uploading

**Check:**
1. User is authenticated
2. Storage bucket exists
3. Policies are correctly set up
4. File size is under 5MB
5. File type is allowed (JPEG, PNG, etc.)

**Debug:**
```typescript
// Check console logs in add-item.tsx
console.log('Uploading images to Supabase...');
```

### Issue: Images upload but don't display

**Check:**
1. Bucket is set to **public**
2. SELECT policy exists for public access
3. URLs are correctly stored in database
4. Network connectivity

## File Structure

After setup, your images will be organized as:

```
Storage > marketplace-images/
├── {user-id-1}/
│   ├── 1697xxx_abc123.jpg
│   └── 1697xxx_def456.jpg
└── {user-id-2}/
    └── 1697xxx_ghi789.jpg
```

## Security Notes

✅ **Implemented:**
- File size limits (5MB)
- File type restrictions (images only)
- User isolation (separate folders)
- Authenticated uploads only
- Owner-only modifications
- Public read access

⚠️ **Consider Adding:**
- Rate limiting on uploads
- Image compression/optimization
- Virus scanning
- Content moderation
- Automatic cleanup of old images

## Next Steps

After setup is complete:

1. ✅ Test creating a marketplace item
2. ✅ Verify images appear in Storage
3. ✅ Check images display in app
4. ✅ Test image carousel functionality
5. ✅ Test on different devices

## Need Help?

Check the following files for implementation details:
- `/lib/imageUpload.ts` - Upload utilities
- `/app/marketplace/add-item.tsx` - Upload UI
- `/docs/MARKETPLACE_IMAGES.md` - Usage guide
