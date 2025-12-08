-- Add frostings column to cake_orders table
-- Frostings will be stored as JSON string array (max 2 selections)

ALTER TABLE cake_orders
ADD COLUMN IF NOT EXISTS frostings TEXT;

-- Add comment to document the column
COMMENT ON COLUMN cake_orders.frostings IS 'JSON array of selected frostings/fillings (max 2), e.g., ["Chocolate", "Vanilla"]';

