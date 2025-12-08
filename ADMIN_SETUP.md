# Admin User Setup Guide

This guide explains how to set up the admin user system for Tmore's Cakes.

## Prerequisites

1. Make sure you have installed `bcryptjs`:
   ```bash
   npm install bcryptjs @types/bcryptjs
   ```

2. Ensure your Supabase database is set up and accessible.

## Step 1: Create the Database Table

Run the SQL migration file to create the `admin_users` table:

```sql
-- Run this in your Supabase SQL editor or via psql
-- File: create-admin-users-table.sql
```

Or execute the SQL directly:
```sql
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
```

## Step 2: Create Your First Admin User

You have two options to create your first admin user:

### Option A: Using the Setup Script (Recommended)

1. Make sure your `.env` file has the Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   # Or use SUPABASE_SERVICE_ROLE_KEY for more permissions
   ```

2. Run the script:
   ```bash
   node scripts/create-admin-user.js admin@tmorescakes.com yourSecurePassword123
   ```

### Option B: Using the API Endpoint

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Make a POST request to create the admin user:
   ```bash
   curl -X POST http://localhost:3000/api/admin/create-initial-admin \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@tmorescakes.com",
       "password": "yourSecurePassword123"
     }'
   ```

   **Note:** After creating your first admin user, you should remove or secure this endpoint in production.

## Step 3: Log In

1. Navigate to `/admin` in your browser
2. Enter your admin email and password
3. You'll be redirected to the admin dashboard

## Step 4: Change Your Password

1. Once logged in, click on the "Account Settings" tab
2. Enter your current password and new password
3. Click "Change Password"

## Security Notes

1. **Change Default Password**: If you used a default password, change it immediately after first login.

2. **Remove Setup Endpoint**: In production, remove or protect the `/api/admin/create-initial-admin` endpoint to prevent unauthorized user creation.

3. **Enable RLS**: For production, consider enabling Row Level Security (RLS) on the `admin_users` table and creating appropriate policies.

4. **Use Strong Passwords**: Ensure all admin passwords are strong (at least 12 characters, mix of letters, numbers, and symbols).

5. **Session Management**: Currently, authentication is stored in `sessionStorage`. For production, consider implementing JWT tokens with proper expiration.

## API Endpoints

### POST `/api/admin/login`
Authenticate an admin user.

**Request:**
```json
{
  "email": "admin@tmorescakes.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "admin@tmorescakes.com"
  }
}
```

### POST `/api/admin/change-password`
Change an admin user's password.

**Request:**
```json
{
  "email": "admin@tmorescakes.com",
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

## Troubleshooting

### "Invalid credentials" error
- Verify the admin user exists in the database
- Check that the password is correct
- Ensure bcryptjs is installed

### "Failed to create admin user"
- Check that the `admin_users` table exists
- Verify Supabase connection credentials
- Ensure the email is unique (not already in use)

### Password change not working
- Make sure you're logged in (check sessionStorage)
- Verify your current password is correct
- Ensure the new password meets requirements (min 6 characters)

