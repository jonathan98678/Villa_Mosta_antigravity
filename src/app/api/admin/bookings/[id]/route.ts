import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// GET - Get single booking
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { id } = await params
        const supabase = createAdminClient()

        const { data: booking, error } = await supabase
            .from('bookings')
            .select(`
        *,
        room:rooms(id, name, slug, base_price, images)
      `)
            .eq('id', id)
            .single()

        if (error || !booking) {
            return NextResponse.json(
                { error: 'Booking not found', success: false },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: booking, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// PUT - Update booking status
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { id } = await params
        const body = await request.json()

        const supabase = createAdminClient()

        const updateData: Record<string, unknown> = {}

        if (body.booking_status !== undefined) {
            updateData.booking_status = body.booking_status
        }
        if (body.payment_status !== undefined) {
            updateData.payment_status = body.payment_status
        }
        if (body.special_requests !== undefined) {
            updateData.special_requests = body.special_requests
        }

        const { data: booking, error } = await supabase
            .from('bookings')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating booking:', error)
            return NextResponse.json(
                { error: 'Failed to update booking', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: booking, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
