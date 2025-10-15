# Storage Policies Quick Setup Guide

Since the migration can't automatically create storage policies, you need to set them up manually via the Supabase Dashboard.

## Quick Setup (5 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** → **marketplace-images** → **Policies**
4. Click **New Policy** for each of the following:

---

## Policy #1: Public Read Access

**Name:** `Anyone can view marketplace images`

**Allowed operation:** `SELECT`

**Target roles:** `public` (or leave empty for all roles)

**Policy definition (USING):**
```sql
bucket_id = 'marketplace-images'
```

---

## Policy #2: Authenticated Upload

**Name:** `Authenticated users can upload marketplace images`

**Allowed operation:** `INSERT`

**Target roles:** `authenticated`

**WITH CHECK:**
```sql
bucket_id = 'marketplace-images' AND auth.uid() IS NOT NULL
```

---

## Policy #3: Owner Update

**Name:** `Users can update their own marketplace images`

**Allowed operation:** `UPDATE`

**Target roles:** `authenticated`

**USING expression:**
```sql
bucket_id = 'marketplace-images' AND auth.uid() = owner
```

**WITH CHECK:**
```sql
bucket_id = 'marketplace-images' AND auth.uid() = owner
```

---

## Policy #4: Owner Delete

**Name:** `Users can delete their own marketplace images`

**Allowed operation:** `DELETE`

**Target roles:** `authenticated`

**USING expression:**
```sql
bucket_id = 'marketplace-images' AND auth.uid() = owner
```

---

## Alternative: Run SQL Script

If you prefer SQL, copy and run the contents of:
`scripts/setup-marketplace-storage-policies.sql`

in the Supabase SQL Editor.

---

## Verify Policies

Run this query to check all policies are created:

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%marketplace%'
ORDER BY policyname;
```

You should see 4 policies:
- `Anyone can view marketplace images` (SELECT)
- `Authenticated users can upload marketplace images` (INSERT)
- `Users can update their own marketplace images` (UPDATE)
- `Users can delete their own marketplace images` (DELETE)

---

## Why Manual Setup?

Storage policies require special permissions on the `storage.objects` table that regular migrations don't have. This is a Supabase security feature to prevent accidental modification of storage infrastructure.

The bucket itself is created automatically by the migration, but policies must be added manually.
