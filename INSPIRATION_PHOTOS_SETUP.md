# Inspiration Photos Setup Guide

This guide explains how to ensure inspiration photos are properly saved and displayed.

## Issues Identified and Fixed

### 1. **Storage Bucket Setup**
   - The storage bucket `inspiration-photos` must exist in Supabase
   - It needs proper permissions for file uploads

### 2. **Server-Side Upload Permissions**
   - API route now uses service role key (if available) for uploads
   - Falls back to anon key if service role key is not set

### 3. **Error Handling**
   - Added comprehensive logging throughout the upload process
   - Better error messages to identify issues

### 4. **Database Column**
   - The `inspiration_photo_urls` JSONB column must exist
   - Migration file: `add-inspiration-photos-column.sql`

## Setup Steps

### Step 1: Run Database Migration

Run the SQL migration in your Supabase SQL editor:

```sql
-- File: add-inspiration-photos-column.sql
-- This adds the inspiration_photo_urls JSONB column
```

### Step 2: Create Storage Bucket

Run the SQL in `check-storage-setup.sql` to create the storage bucket:

```sql
-- File: check-storage-setup.sql
-- This creates the inspiration-photos bucket with proper permissions
```

Or manually in Supabase Dashboard:
1. Go to Storage
2. Create new bucket: `inspiration-photos`
3. Make it public
4. Set file size limit (e.g., 50MB)
5. Set allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`

### Step 3: Set Environment Variables

Add to your `.env` file (optional but recommended for server-side uploads):

```env
# For server-side uploads (recommended)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note:** The service role key bypasses RLS and allows server-side uploads. If not set, it will use the anon key, which may require proper RLS policies.

### Step 4: Verify Setup

1. **Check Storage Bucket:**
   - Go to Supabase Dashboard → Storage
   - Verify `inspiration-photos` bucket exists and is public

2. **Check Database Column:**
   - Go to Supabase Dashboard → Table Editor → `cake_orders`
   - Verify `inspiration_photo_urls` column exists (type: JSONB)

3. **Test Upload:**
   - Submit a test order with inspiration photos
   - Check browser console for upload logs
   - Check server logs for any errors
   - Verify photos appear in Storage bucket
   - Verify URLs are saved in database

## Debugging

### Check Browser Console
When submitting a form, you should see:
- `Submitting form with inspiration photos: X`
- `Appending photo 0: filename.jpg (size bytes)`
- `FormData entries: ...`

### Check Server Logs
In your server console, you should see:
- `Inspiration photo count: X`
- `Processing photo 0: {exists: true, name: ..., size: ..., type: ...}`
- `Uploading file: timestamp-0-random.jpg`
- `Successfully uploaded: ...`
- `Public URL for photo 0: ...`
- `Total photos uploaded: X out of X`
- `Saving order to database with photo URLs: [...]`

### Common Issues

1. **"Storage bucket does not exist"**
   - Solution: Run `check-storage-setup.sql` or create bucket manually

2. **"File upload error"**
   - Check storage bucket permissions
   - Verify service role key is set (or anon key has upload permissions)
   - Check file size limits

3. **"Database error"**
   - Verify `inspiration_photo_urls` column exists
   - Check column type is JSONB
   - Verify RLS policies allow inserts

4. **Photos not displaying in admin**
   - Check database has URLs saved
   - Verify URLs are accessible (public bucket)
   - Check browser console for image load errors

## Testing Checklist

- [ ] Storage bucket `inspiration-photos` exists and is public
- [ ] Database column `inspiration_photo_urls` exists (JSONB type)
- [ ] Environment variable `SUPABASE_SERVICE_ROLE_KEY` is set (optional)
- [ ] Can submit form with inspiration photos
- [ ] Photos appear in Supabase Storage
- [ ] URLs are saved in database
- [ ] Photos display in admin view modal

## Code Changes Made

1. **API Route (`app/api/submit/route.ts`):**
   - Uses service role key for uploads (if available)
   - Added comprehensive logging
   - Better error handling
   - Bucket existence check
   - Improved file upload process

2. **Form Component (`app/components/CakeForm.tsx`):**
   - Added logging for form submission
   - Validates files are being sent

3. **Admin Display (`app/admin/page.tsx`):**
   - Enhanced photo display with better error handling
   - Improved parsing of JSONB data
   - Better image rendering

## Next Steps

1. Run the SQL migrations
2. Create/verify the storage bucket
3. Test with a sample order
4. Check logs to verify everything works
5. Remove debug logging if desired (or keep for production debugging)

