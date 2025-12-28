-- Check if storage bucket exists and create if needed
-- Run this in your Supabase SQL editor

-- Check existing buckets
SELECT * FROM storage.buckets WHERE id = 'inspiration-photos';

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'inspiration-photos',
    'inspiration-photos',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public read access
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'inspiration-photos');

-- Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'inspiration-photos');

-- For server-side uploads (using service role), we need to allow service role
-- Note: Service role bypasses RLS, so this is mainly for reference
-- The API route should use service role key for uploads if anon key doesn't work

-- Verify the bucket was created
SELECT * FROM storage.buckets WHERE id = 'inspiration-photos';

