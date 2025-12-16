import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';

interface OrderNotificationData {
    orderId: string;
    name: string;
    email: string;
    phone?: string;
    cakeType: string;
    size: string;
    occasion?: string;
    description?: string;
    date: string;
    deliveryOption?: string;
    deliveryAddress?: string;
    inscription?: string;
    topper?: string;
    flavors: string[];
    frostings: string[];
    targetBudget?: string;
    contactMethod?: string;
    contactTime?: string;
    paymentMethod?: string;
    photoUrl?: string | null;
    photoUrls?: string[];
}

async function sendOrderNotification(data: OrderNotificationData) {
    const recipientEmail = 'tmorescakes@gmail.com';

    // Format flavors and frostings
    const flavorsText = data.flavors.length > 0 ? data.flavors.join(', ') : 'Not specified';
    const frostingsText = data.frostings.length > 0 ? data.frostings.join(', ') : 'Not specified';

    // Build email HTML
    const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(to right, #fbbf24, #f59e0b); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
                .section { margin-bottom: 20px; }
                .label { font-weight: bold; color: #1f2937; }
                .value { color: #4b5563; margin-left: 10px; }
                .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🎂 New Cake Order Received</h2>
                    <p>Order ID: ${data.orderId.substring(0, 8).toUpperCase()}</p>
                </div>
                <div class="content">
                    <div class="section">
                        <h3>Customer Information</h3>
                        <p><span class="label">Name:</span><span class="value">${data.name}</span></p>
                        <p><span class="label">Email:</span><span class="value">${data.email}</span></p>
                        ${data.phone ? `<p><span class="label">Phone:</span><span class="value">${data.phone}</span></p>` : ''}
                    </div>
                    
                    <div class="section">
                        <h3>Order Details</h3>
                        <p><span class="label">Cake Type:</span><span class="value">${data.cakeType}</span></p>
                        <p><span class="label">Size:</span><span class="value">${data.size}</span></p>
                        ${data.occasion ? `<p><span class="label">Occasion:</span><span class="value">${data.occasion}</span></p>` : ''}
                        <p><span class="label">Date Needed:</span><span class="value">${new Date(data.date).toLocaleDateString()}</span></p>
                    </div>
                    
                    <div class="section">
                        <h3>Flavors & Frostings</h3>
                        <p><span class="label">Flavors:</span><span class="value">${flavorsText}</span></p>
                        <p><span class="label">Frostings:</span><span class="value">${frostingsText}</span></p>
                    </div>
                    
                    ${data.inscription ? `
                    <div class="section">
                        <h3>Inscription</h3>
                        <div class="highlight">${data.inscription}</div>
                    </div>
                    ` : ''}
                    
                    ${data.topper ? `
                    <div class="section">
                        <p><span class="label">Topper:</span><span class="value">${data.topper === 'yes' ? 'Yes' : 'No'}</span></p>
                    </div>
                    ` : ''}
                    
                    ${data.description ? `
                    <div class="section">
                        <h3>Description</h3>
                        <div class="highlight">${data.description}</div>
                    </div>
                    ` : ''}
                    
                    <div class="section">
                        <h3>Delivery Information</h3>
                        <p><span class="label">Option:</span><span class="value">${data.deliveryOption || 'Not specified'}</span></p>
                        ${data.deliveryAddress ? `<p><span class="label">Address:</span><span class="value">${data.deliveryAddress}</span></p>` : ''}
                    </div>
                    
                    <div class="section">
                        <h3>Contact Preferences</h3>
                        ${data.contactMethod ? `<p><span class="label">Best Contact Method:</span><span class="value">${data.contactMethod}</span></p>` : ''}
                        ${data.contactTime ? `<p><span class="label">Best Time to Contact:</span><span class="value">${data.contactTime}</span></p>` : ''}
                        ${data.paymentMethod ? `<p><span class="label">Payment Method:</span><span class="value">${data.paymentMethod}</span></p>` : ''}
                        ${data.targetBudget ? `<p><span class="label">Target Budget:</span><span class="value">${data.targetBudget}</span></p>` : ''}
                    </div>
                    
                    ${(data.photoUrls && data.photoUrls.length > 0) || data.photoUrl ? `
                    <div class="section">
                        <h3>Inspiration Photo${(data.photoUrls && data.photoUrls.length > 1) ? 's' : ''}</h3>
                        ${data.photoUrls && data.photoUrls.length > 0 ?
                data.photoUrls.map((url, index) => `<p><a href="${url}" target="_blank">View Photo ${index + 1}</a></p>`).join('') :
                data.photoUrl ? `<p><a href="${data.photoUrl}" target="_blank">View Photo</a></p>` : ''
            }
                    </div>
                    ` : ''}
                </div>
            </div>
        </body>
        </html>
    `;

    // Try using Resend API (if API key is set)
    if (process.env.RESEND_API_KEY) {
        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Tmore\'s Cakes <onboarding@resend.dev>', // Use Resend's test domain or verify your own domain
                to: [recipientEmail],
                subject: `New Cake Order from ${data.name} - ${data.cakeType}`,
                html: emailHtml,
            }),
        });

        if (!resendResponse.ok) {
            throw new Error('Failed to send email via Resend');
        }
    } else {
        // Fallback: Use a simple email service or log
        // For production, you should set up Resend API key
        console.log('Email notification (Resend API key not set):', {
            to: recipientEmail,
            subject: `New Cake Order from ${data.name}`,
            orderId: data.orderId
        });

        // Alternative: You can use other email services here
        // For now, we'll just log it. Set RESEND_API_KEY in your .env file to enable email sending
    }
}

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
        const deliveryOption = formData.get('deliveryOption') as string;
        const inscription = formData.get('inscription') as string;
        const topper = formData.get('topper') as string;
        const flavorsJson = formData.get('flavors') as string;
        const flavors = flavorsJson ? JSON.parse(flavorsJson) : [];
        const frostingsJson = formData.get('frostings') as string;
        const frostings = frostingsJson ? JSON.parse(frostingsJson) : [];
        const deliveryAddress = formData.get('deliveryAddress') as string;
        const targetBudget = formData.get('targetBudget') as string;
        const contactMethod = formData.get('contactMethod') as string;
        const contactTime = formData.get('contactTime') as string;
        const paymentMethod = formData.get('paymentMethod') as string;
        const inspirationPhotoCount = parseInt(formData.get('inspirationPhotoCount') as string) || 0;

        // Validate required fields
        if (!name || !email || !cakeType || !size || !date) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Handle multiple file uploads to Supabase Storage (optional)
        const photoUrls: string[] = [];
        if (inspirationPhotoCount > 0) {
            try {
                for (let i = 0; i < inspirationPhotoCount; i++) {
                    const inspirationPhoto = formData.get(`inspirationPhoto_${i}`) as File;
                    if (inspirationPhoto && inspirationPhoto.size > 0) {
                        const fileExt = inspirationPhoto.name.split('.').pop();
                        const fileName = `${Date.now()}-${i}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from('inspiration-photos')
                            .upload(fileName, inspirationPhoto);

                        if (uploadError) {
                            console.error('File upload error:', uploadError);
                        } else {
                            const { data: { publicUrl } } = supabase.storage
                                .from('inspiration-photos')
                                .getPublicUrl(fileName);
                            photoUrls.push(publicUrl);
                        }
                    }
                }
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        }

        // For backward compatibility, use first photo URL or null
        const photoUrl = photoUrls.length > 0 ? photoUrls[0] : null;

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
                delivery_option: deliveryOption,
                inscription: inscription || null,
                topper: topper || null,
                flavors: flavors.length > 0 ? JSON.stringify(flavors) : null,
                frostings: frostings.length > 0 ? JSON.stringify(frostings) : null,
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

        // Send email notification
        try {
            await sendOrderNotification({
                orderId: data[0].id,
                name,
                email,
                phone,
                cakeType,
                size,
                occasion,
                description,
                date,
                deliveryOption,
                deliveryAddress,
                inscription,
                topper,
                flavors,
                frostings,
                targetBudget,
                contactMethod,
                contactTime,
                paymentMethod,
                photoUrl,
                photoUrls: photoUrls.length > 0 ? photoUrls : undefined
            });
        } catch (emailError) {
            console.error('Error sending email notification:', emailError);
            // Don't fail the request if email fails
        }

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