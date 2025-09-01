import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for cake requests
export interface CakeRequest {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cake_type: string;
    size: string;
    occasion?: string;
    description?: string;
    date_needed: string;
    status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
} 