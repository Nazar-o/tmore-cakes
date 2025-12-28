import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations (if available)
// This bypasses RLS and allows file uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client with service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

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
                img { max-width: 100%; height: auto; display: block; }
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
                    
                    ${data.photoUrls && data.photoUrls.length > 0 ? `
                    <div class="section">
                        <h3>Inspiration Photo${data.photoUrls.length > 1 ? 's' : ''}</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                            ${data.photoUrls.map((url, index) => `
                                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fff;">
                                    <img src="${url}" alt="Inspiration Photo ${index + 1}" style="width: 100%; height: auto; display: block; max-height: 300px; object-fit: contain;" />
                                    <div style="padding: 10px; text-align: center; background: #f9fafb;">
                                        <a href="${url}" target="_blank" style="color: #f59e0b; text-decoration: none; font-size: 12px; font-weight: 600;">View Full Size</a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <p style="margin-top: 15px; font-size: 12px; color: #6b7280;">
                            ${data.photoUrls.length === 1 ? 'If the image above does not display, ' : 'If the images above do not display, '}
                            <a href="${data.photoUrls[0]}" target="_blank" style="color: #f59e0b;">click here to view the photo${data.photoUrls.length > 1 ? 's' : ''}</a>
                        </p>
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
        // Check if Supabase is configured
        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Supabase configuration missing');
            return NextResponse.json(
                { message: 'Server configuration error. Please contact support.' },
                { status: 500 }
            );
        }

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

        // Handle multiple file uploads to Supabase Storage
        const photoUrls: string[] = [];
        console.log('Inspiration photo count:', inspirationPhotoCount);

        if (inspirationPhotoCount > 0) {
            try {
                // First, verify the storage bucket exists
                const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
                if (bucketError) {
                    console.error('Error listing buckets:', bucketError);
                } else {
                    const bucketExists = buckets?.some(bucket => bucket.id === 'inspiration-photos');
                    console.log('Storage bucket exists:', bucketExists);
                    if (!bucketExists) {
                        console.warn('Storage bucket "inspiration-photos" does not exist. Please create it in Supabase dashboard.');
                    }
                }

                for (let i = 0; i < inspirationPhotoCount; i++) {
                    const inspirationPhoto = formData.get(`inspirationPhoto_${i}`) as File;
                    console.log(`Processing photo ${i}:`, {
                        exists: !!inspirationPhoto,
                        name: inspirationPhoto?.name,
                        size: inspirationPhoto?.size,
                        type: inspirationPhoto?.type
                    });

                    if (inspirationPhoto && inspirationPhoto.size > 0) {
                        const fileExt = inspirationPhoto.name.split('.').pop() || 'jpg';
                        const fileName = `${Date.now()}-${i}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                        console.log(`Uploading file: ${fileName}`);

                        // Convert File to ArrayBuffer for upload
                        const fileBuffer = await inspirationPhoto.arrayBuffer();

                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from('inspiration-photos')
                            .upload(fileName, fileBuffer, {
                                contentType: inspirationPhoto.type || 'image/jpeg',
                                upsert: false
                            });

                        if (uploadError) {
                            console.error(`File upload error for photo ${i}:`, uploadError);
                            console.error('Upload error details:', {
                                message: uploadError.message,
                                name: uploadError.name
                            });
                        } else {
                            console.log(`Successfully uploaded: ${fileName}`, uploadData);
                            const { data: { publicUrl } } = supabase.storage
                                .from('inspiration-photos')
                                .getPublicUrl(fileName);
                            console.log(`Public URL for photo ${i}:`, publicUrl);
                            photoUrls.push(publicUrl);
                        }
                    } else {
                        console.warn(`Photo ${i} is missing or empty`);
                    }
                }

                console.log(`Total photos uploaded: ${photoUrls.length} out of ${inspirationPhotoCount}`);
            } catch (error) {
                console.error('Error uploading files:', error);
                console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            }
        } else {
            console.log('No inspiration photos to upload');
        }

        // Save to Supabase database
        const orderData = {
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
            inspiration_photo_urls: photoUrls.length > 0 ? photoUrls : null, // Store all photos as JSON array
            status: 'pending',
            created_at: new Date().toISOString()
        };

        console.log('Saving order to database with photo URLs:', photoUrls);
        console.log('Order data (excluding large fields):', {
            ...orderData,
            inspiration_photo_urls: photoUrls.length > 0 ? `${photoUrls.length} photos` : null
        });

        const { data, error } = await supabase
            .from('cake_orders')
            .insert([orderData])
            .select();

        if (error) {
            console.error('Database error:', error);
            console.error('Database error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return NextResponse.json(
                { message: 'Failed to save order to database', error: error.message },
                { status: 500 }
            );
        }

        // Log the submission for debugging
        console.log('Cake request saved to database:', data[0]);
        console.log('Saved inspiration_photo_urls:', data[0]?.inspiration_photo_urls);

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

        // Ensure we always return JSON, even for unexpected errors
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json(
            {
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}