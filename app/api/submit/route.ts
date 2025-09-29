import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract form fields
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const cakeType = formData.get('cakeType') as string;
        const size = formData.get('size') as string;
        const occasion = formData.get('occasion') as string;
        const description = formData.get('description') as string;
        const date = formData.get('date') as string;
        const dietaryRestrictions = formData.get('dietaryRestrictions') as string;
        const deliveryOption = formData.get('deliveryOption') as string;
        const deliveryAddress = formData.get('deliveryAddress') as string;
        const targetBudget = formData.get('targetBudget') as string;
        const contactMethod = formData.get('contactMethod') as string;
        const contactTime = formData.get('contactTime') as string;
        const paymentMethod = formData.get('paymentMethod') as string;
        const inspirationPhoto = formData.get('inspirationPhoto') as File;

        // Validate required fields
        if (!name || !email || !cakeType || !size || !date) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Handle file upload to Supabase Storage (optional)
        let photoUrl = null;
        if (inspirationPhoto && inspirationPhoto.size > 0) {
            try {
                const fileExt = inspirationPhoto.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('inspiration-photos')
                    .upload(fileName, inspirationPhoto);

                if (uploadError) {
                    console.error('File upload error:', uploadError);
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('inspiration-photos')
                        .getPublicUrl(fileName);
                    photoUrl = publicUrl;
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        // Save to Supabase database
        const { data, error } = await supabase
            .from('cake_orders')
            .insert([{
                name,
                email,
                phone,
                cake_type: cakeType,
                size,
                occasion,
                description,
                date_needed: date,
                dietary_restrictions: dietaryRestrictions,
                delivery_option: deliveryOption,
                delivery_address: deliveryAddress,
                target_budget: targetBudget,
                contact_method: contactMethod,
                contact_time: contactTime,
                payment_method: paymentMethod,
                inspiration_photo_url: photoUrl,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { message: 'Failed to save order to database' },
                { status: 500 }
            );
        }

        // Log the submission for debugging
        console.log('Cake request saved to database:', data[0]);

        // Return success response with the database ID
        return NextResponse.json({
            message: 'Cake request submitted successfully!',
            requestId: data[0].id
        });
    } catch (error) {
        console.error('Error submitting cake request:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}