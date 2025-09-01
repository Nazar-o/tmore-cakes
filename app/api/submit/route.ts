import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, cakeType, size, occasion, description, date } = body;

        // Validate required fields
        if (!name || !email || !cakeType || !size || !date) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Here you would typically:
        // 1. Save to database
        // 2. Send confirmation email
        // 3. Notify staff

        // For now, just log the submission
        console.log('Cake request received:', body);

        // Return success response
        return NextResponse.json({
            message: 'Cake request submitted successfully!',
            requestId: Date.now().toString()
        });
    } catch (error) {
        console.error('Error submitting cake request:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 