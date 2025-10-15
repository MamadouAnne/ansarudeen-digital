# ⚠️ ACTION REQUIRED: Setup Storage Policies

Your marketplace image upload is **BLOCKED** because storage policies are not set up yet.

## Error You're Seeing
```
StorageApiError: new row violates row-level security policy
```

## Quick Fix (5 minutes)

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** → **marketplace-images** bucket

### Step 2: Create 4 Policies

Click **"New Policy"** and create each of these:

---

#### Policy 1: Public Read 👁️

- **Policy name**: `Anyone can view marketplace images`
- **Allowed operation**: ✅ SELECT
- **Policy definition**:
  ```sql
  bucket_id = 'marketplace-images'
  ```

---

#### Policy 2: Authenticated Upload ⬆️

- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: ✅ INSERT
- **Target roles**: `authenticated`
- **WITH CHECK**:
  ```sql
  bucket_id = 'marketplace-images' AND auth.uid() IS NOT NULL
  ```

---

#### Policy 3: Owner Update ✏️

- **Policy name**: `Users can update their own images`
- **Allowed operation**: ✅ UPDATE
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  bucket_id = 'marketplace-images' AND auth.uid() = owner
  ```
- **WITH CHECK**:
  ```sql
  bucket_id = 'marketplace-images' AND auth.uid() = owner
  ```

---

#### Policy 4: Owner Delete 🗑️

- **Policy name**: `Users can delete their own images`
- **Allowed operation**: ✅ DELETE
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  bucket_id = 'marketplace-images' AND auth.uid() = owner
  ```

---

## Alternative: Run SQL Script

If you prefer SQL, copy and paste this into **SQL Editor**:

```sql
-- Policy 1: Public Read
CREATE POLICY "Anyone can view marketplace images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'marketplace-images');

-- Policy 2: Authenticated Upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'marketplace-images' AND
  auth.uid() IS NOT NULL
);

-- Policy 3: Owner Update
CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'marketplace-images' AND
  auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'marketplace-images' AND
  auth.uid() = owner
);

-- Policy 4: Owner Delete
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'marketplace-images' AND
  auth.uid() = owner
);
```

---

## Verify It Works

After creating the policies:

1. Go back to your app
2. Try uploading an image again
3. It should work! ✅

---

## Troubleshooting

**Still getting RLS error?**
- Make sure all 4 policies are created
- Check that user is logged in
- Verify bucket name is exactly `marketplace-images`

**Can't create policies?**
- You need admin access to the project
- Try using the SQL script method instead
