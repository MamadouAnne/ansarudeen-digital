# Marketplace Image Upload System

## Overview

The marketplace feature uses Supabase Storage to store and serve product images. Users can upload up to 6 images per marketplace item.

## Storage Setup

### Bucket Configuration

- **Bucket Name**: `marketplace-images`
- **Access**: Public (read-only for everyone)
- **File Size Limit**: 5MB per image
- **Allowed Types**: JPEG, JPG, PNG, WebP, GIF

### RLS Policies

1. **Public Read**: Anyone can view images
2. **Authenticated Upload**: Only logged-in users can upload
3. **Owner Update/Delete**: Users can only modify/delete their own images

## File Structure

Images are organized by user ID:

```
marketplace-images/
├── {user-id-1}/
│   ├── {timestamp}_abc123.jpg
│   └── {timestamp}_def456.jpg
└── {user-id-2}/
    └── {timestamp}_ghi789.jpg
```

## Usage

### Upload Single Image

```typescript
import { uploadImageToSupabase } from '@/lib/imageUpload';

const url = await uploadImageToSupabase(
  imageUri,      // Local image URI from picker
  userId,        // Current user ID
  'marketplace-images',  // Optional: bucket name
  'products'     // Optional: subfolder
);
```

### Upload Multiple Images

```typescript
import { uploadMultipleImages } from '@/lib/imageUpload';

const urls = await uploadMultipleImages(
  [uri1, uri2, uri3],  // Array of local URIs
  userId,
  'marketplace-images'
);
```

### Delete Image

```typescript
import { deleteImageFromSupabase } from '@/lib/imageUpload';

const success = await deleteImageFromSupabase(
  publicUrl,
  'marketplace-images'
);
```

## Implementation in Add Item Screen

When a user creates a marketplace listing:

1. User selects images via `expo-image-picker`
2. Images are stored locally in state as URIs
3. On form submit:
   - All images are uploaded to Supabase Storage
   - Upload progress is shown to user
   - Public URLs are received
   - URLs are saved in `marketplace_items.images` array
4. If upload fails, user is notified and can retry

## Image Display

### Marketplace Grid
- Shows first image from array
- Displays image count badge if multiple images exist

### Item Detail Page
- Full-size carousel with navigation arrows
- Thumbnail strip below main image
- Image counter (e.g., "2 / 5")

## Security Considerations

1. **File Size**: Limited to 5MB to prevent abuse
2. **File Types**: Only images are allowed
3. **User Isolation**: Each user's images are stored in their own folder
4. **Ownership**: Users can only delete/update their own uploads
5. **Public Access**: Images are publicly readable but not writable

## Migration Files

1. `20251015120000_create_marketplace_tables.sql` - Creates marketplace tables
2. `20251015130000_create_marketplace_storage.sql` - Creates storage bucket and policies

## Future Improvements

- [ ] Image compression before upload
- [ ] Image optimization (WebP conversion)
- [ ] Thumbnail generation
- [ ] Progress bar for individual image uploads
- [ ] Drag-and-drop reordering
- [ ] Direct camera capture option
- [ ] Automatic cleanup of orphaned images
