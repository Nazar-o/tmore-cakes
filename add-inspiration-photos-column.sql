-- Add column to store multiple inspiration photo URLs as JSON array
-- This allows storing multiple photos per order
ALTER TABLE cake_orders 
ADD COLUMN IF NOT EXISTS inspiration_photo_urls JSONB;

-- Migrate existing single photo URLs to the new array format
UPDATE cake_orders 
SET inspiration_photo_urls = CASE 
    WHEN inspiration_photo_url IS NOT NULL AND inspiration_photo_url != '' 
    THEN jsonb_build_array(inspiration_photo_url)
    ELSE NULL
END
WHERE inspiration_photo_urls IS NULL;

-- Create index for JSONB queries (optional, but can help with performance)
CREATE INDEX IF NOT EXISTS idx_cake_orders_inspiration_photos 
ON cake_orders USING GIN (inspiration_photo_urls);

-- Remove the old single photo URL column after migration
ALTER TABLE cake_orders 
DROP COLUMN IF EXISTS inspiration_photo_url;

