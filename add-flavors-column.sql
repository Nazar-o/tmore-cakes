-- Add flavors column to cake_orders table
-- Flavors will be stored as JSON string array

ALTER TABLE cake_orders
ADD COLUMN IF NOT EXISTS flavors TEXT;

-- Add comment to document the column
COMMENT ON COLUMN cake_orders.flavors IS 'JSON array of selected flavors, e.g., ["Vanilla", "Chocolate", "Strawberry"]';

