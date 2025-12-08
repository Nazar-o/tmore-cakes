import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import bcrypt from 'bcryptjs';

// This is a one-time setup route to create the initial admin user
// You should protect this route or remove it after initial setup
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Check if admin user already exists
        const { data: existingAdmin } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (existingAdmin) {
            return NextResponse.json(
                { message: 'Admin user with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create admin user
        const { data: newAdmin, error: insertError } = await supabase
            .from('admin_users')
            .insert([{
                email: email.toLowerCase().trim(),
                password_hash: passwordHash
            }])
            .select()
            .single();

        if (insertError) {
            console.error('Create admin error:', insertError);
            return NextResponse.json(
                { message: 'Failed to create admin user' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Admin user created successfully',
            user: {
                id: newAdmin.id,
                email: newAdmin.email
            }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

