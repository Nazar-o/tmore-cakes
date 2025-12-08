import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Fetch admin user from database
        const { data: adminUser, error: fetchError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (fetchError || !adminUser) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Return success (in a real app, you might want to generate a JWT token here)
        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: adminUser.id,
                email: adminUser.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

