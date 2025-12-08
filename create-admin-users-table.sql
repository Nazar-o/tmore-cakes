-- Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Disable RLS for simplicity (allows all operations)
-- Note: In production, you should enable RLS and create proper policies
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- After running this migration, use the create-admin-user.js script
-- or the /api/admin/create-initial-admin endpoint to create your first admin user

