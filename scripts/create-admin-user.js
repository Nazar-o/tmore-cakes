/**
 * Script to create the initial admin user
 * 
 * Usage:
 *   node scripts/create-admin-user.js <email> <password>
 * 
 * Example:
 *   node scripts/create-admin-user.js admin@tmorescakes.com mySecurePassword123
 * 
 * Note: Make sure to run the SQL migration first to create the admin_users table
 */

const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase environment variables');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser(email, password) {
    try {
        // Check if admin user already exists
        const { data: existingAdmin } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (existingAdmin) {
            console.error(`Error: Admin user with email ${email} already exists`);
            process.exit(1);
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create admin user
        const { data: newAdmin, error } = await supabase
            .from('admin_users')
            .insert([{
                email: email.toLowerCase().trim(),
                password_hash: passwordHash
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating admin user:', error);
            process.exit(1);
        }

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${newAdmin.email}`);
        console.log(`   ID: ${newAdmin.id}`);
        console.log('\n⚠️  Important: Delete or secure this script after use!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Usage: node scripts/create-admin-user.js <email> <password>');
    console.error('Example: node scripts/create-admin-user.js admin@tmorescakes.com mySecurePassword123');
    process.exit(1);
}

const [email, password] = args;

if (password.length < 6) {
    console.error('Error: Password must be at least 6 characters long');
    process.exit(1);
}

createAdminUser(email, password);

