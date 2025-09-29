-- Query to add a new cake order
-- This query inserts a new order into the cake_orders table with all the required fields

INSERT INTO cake_orders (
    name,
    email,
    phone,
    cake_type,
    size,
    occasion,
    description,
    date_needed,
    dietary_restrictions,
    delivery_option,
    delivery_address,
    target_budget,
    contact_method,
    contact_time,
    payment_method,
    inspiration_photo_url,
    final_price,
    status,
    created_at,
    updated_at
) VALUES (
    'John Smith',                    -- Customer name (required)
    'john.smith@email.com',         -- Customer email (required)
    '555-123-4567',                 -- Phone number (optional)
    'birthday',                     -- Cake type: 'birthday', 'wedding', 'anniversary', 'custom' (required)
    '10-inch',                      -- Size: '8-inch', '10-inch', '12-inch', etc. (required)
    'Birthday Party',               -- Occasion (optional)
    'A beautiful chocolate cake with vanilla frosting and rainbow sprinkles', -- Description (optional)
    '2024-02-15',                   -- Date needed in YYYY-MM-DD format (required)
    'Gluten-free',                  -- Dietary restrictions (optional)
    'pickup',                       -- Delivery option: 'pickup' or 'delivery' (optional)
    NULL,                           -- Delivery address (only if delivery_option = 'delivery')
    '300-500',                      -- Target budget range (optional)
    'phone',                        -- Contact method: 'phone', 'text', 'email' (optional)
    'After 5 PM',                   -- Best time to contact (optional)
    'credit-card',                  -- Payment method (optional)
    NULL,                           -- Inspiration photo URL (optional)
    NULL,                           -- Final price (set by admin later)
    'pending',                      -- Status: 'pending', 'approved', 'in_progress', 'completed', 'cancelled'
    NOW(),                          -- Created timestamp
    NOW()                           -- Updated timestamp
);

-- Alternative query with delivery option
INSERT INTO cake_orders (
    name,
    email,
    phone,
    cake_type,
    size,
    occasion,
    description,
    date_needed,
    dietary_restrictions,
    delivery_option,
    delivery_address,
    target_budget,
    contact_method,
    contact_time,
    payment_method,
    inspiration_photo_url,
    final_price,
    status,
    created_at,
    updated_at
) VALUES (
    'Jane Doe',
    'jane.doe@email.com',
    '555-987-6543',
    'wedding',
    '2-tier-6-8',
    'Wedding Reception',
    'Elegant white wedding cake with gold accents and fresh flowers',
    '2024-06-15',
    'Nut allergy',
    'delivery',
    '123 Main Street, Anytown, ST 12345',
    '500-750',
    'email',
    'Weekends only',
    'zelle',
    NULL,
    NULL,
    'pending',
    NOW(),
    NOW()
);

-- Query to get the inserted order (for verification)
SELECT * FROM cake_orders 
WHERE email = 'john.smith@email.com' 
ORDER BY created_at DESC 
LIMIT 1;

-- Query to get all pending orders
SELECT 
    id,
    name,
    email,
    cake_type,
    size,
    occasion,
    date_needed,
    status,
    created_at
FROM cake_orders 
WHERE status = 'pending'
ORDER BY date_needed ASC;

-- Query to update an order status (example)
UPDATE cake_orders 
SET 
    status = 'approved',
    updated_at = NOW()
WHERE id = 'your-order-id-here';

-- Query to set final price for an order
UPDATE cake_orders 
SET 
    final_price = 350.00,
    updated_at = NOW()
WHERE id = 'your-order-id-here';