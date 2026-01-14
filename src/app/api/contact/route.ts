import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, subject, message } = body

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields', data: null, success: false },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format', data: null, success: false },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        const { data: contactRequest, error } = await supabase
            .from('contact_requests')
            .insert({
                name,
                email,
                phone: phone || null,
                subject,
                message,
                is_read: false,
                is_responded: false
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating contact request:', error)
            return NextResponse.json(
                { error: 'Failed to submit contact request', data: null, success: false },
                { status: 500 }
            )
        }

        // TODO: Send email notification to admin

        return NextResponse.json({
            data: { id: contactRequest.id },
            error: null,
            success: true,
            message: 'Thank you for your message. We will get back to you soon!'
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', data: null, success: false },
            { status: 500 }
        )
    }
}
