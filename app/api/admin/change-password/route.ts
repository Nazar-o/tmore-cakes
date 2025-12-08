import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, currentPassword, newPassword } = await request.json();

        if (!email || !currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Email, current password, and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: 'New password must be at least 6 characters long' },
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

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, adminUser.password_hash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Current password is incorrect' },
                { status: 401 }
            );
        }

        // Hash new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password in database
        const { error: updateError } = await supabase
            .from('admin_users')
            .update({
                password_hash: newPasswordHash,
                updated_at: new Date().toISOString()
            })
            .eq('id', adminUser.id);

        if (updateError) {
            console.error('Password update error:', updateError);
            return NextResponse.json(
                { message: 'Failed to update password' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

