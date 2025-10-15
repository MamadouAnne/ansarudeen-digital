import { supabase } from './supabase';
import { readAsStringAsync } from 'expo-file-system/legacy';

/**
 * Upload an image to Supabase storage (React Native compatible)
 * @param uri - Local image URI
 * @param userId - User ID for organizing files
 * @param bucket - Storage bucket name
 * @param folder - Optional folder path within the bucket
 * @returns Public URL of uploaded image or null on failure
 */
export async function uploadImageToSupabase(
  uri: string,
  userId: string,
  bucket: string = 'marketplace-images',
  folder?: string
): Promise<string | null> {
  try {
    // Read file as base64 using legacy API
    const base64 = await readAsStringAsync(uri, {
      encoding: 'base64',
    });

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const folderPath = folder ? `${folder}/` : '';
    const fileName = `${folderPath}${userId}/${timestamp}_${random}.jpg`;

    // Convert base64 to array buffer for upload
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, bytes, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Upload multiple images to Supabase storage
 * @param uris - Array of local image URIs
 * @param userId - User ID for organizing files
 * @param bucket - Storage bucket name
 * @param folder - Optional folder path within the bucket
 * @returns Array of public URLs (successful uploads only)
 */
export async function uploadMultipleImages(
  uris: string[],
  userId: string,
  bucket: string = 'marketplace-images',
  folder?: string
): Promise<string[]> {
  const uploadPromises = uris.map((uri) =>
    uploadImageToSupabase(uri, userId, bucket, folder)
  );

  const results = await Promise.all(uploadPromises);

  // Filter out failed uploads (null values)
  return results.filter((url): url is string => url !== null);
}

/**
 * Delete an image from Supabase storage
 * @param url - Public URL of the image to delete
 * @param bucket - Storage bucket name
 * @returns True if successful, false otherwise
 */
export async function deleteImageFromSupabase(
  url: string,
  bucket: string = 'marketplace-images'
): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) {
      console.error('Invalid image URL format');
      return false;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Delete multiple images from Supabase storage
 * @param urls - Array of public URLs to delete
 * @param bucket - Storage bucket name
 * @returns Number of successfully deleted images
 */
export async function deleteMultipleImages(
  urls: string[],
  bucket: string = 'marketplace-images'
): Promise<number> {
  const deletePromises = urls.map((url) =>
    deleteImageFromSupabase(url, bucket)
  );

  const results = await Promise.all(deletePromises);

  // Count successful deletions
  return results.filter((success) => success).length;
}
