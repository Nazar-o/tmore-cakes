-- Create the cake_orders table
CREATE TABLE IF NOT EXISTS cake_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    cake_type TEXT NOT NULL,
    size TEXT NOT NULL,
    occasion TEXT,
    description TEXT,
    date_needed DATE NOT NULL,
    dietary_restrictions TEXT,
    delivery_option TEXT,
    delivery_address TEXT,
    target_budget TEXT,
    contact_method TEXT,
    contact_time TEXT,
    payment_method TEXT,
    inspiration_photo_url TEXT,
    final_price DECIMAL(10,2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cake_orders_date_needed ON cake_orders(date_needed);
CREATE INDEX IF NOT EXISTS idx_cake_orders_status ON cake_orders(status);

-- Create storage bucket for inspiration photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('inspiration-photos', 'inspiration-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Disable RLS for simplicity (allows all operations)
ALTER TABLE cake_orders DISABLE ROW LEVEL SECURITY;

-- Create simple storage policies
CREATE POLICY "Allow all storage operations" ON storage.objects
    FOR ALL USING (true);