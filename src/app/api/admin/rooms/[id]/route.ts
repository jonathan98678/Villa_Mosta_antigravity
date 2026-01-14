import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

// GET - Get single room
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { id } = await params
        const supabase = createAdminClient()

        const { data: room, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !room) {
            return NextResponse.json(
                { error: 'Room not found', success: false },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: room, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// PUT - Update room
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

        // Build update object
        const updateData: Record<string, unknown> = {}

        if (body.name !== undefined) {
            updateData.name = body.name
            updateData.slug = generateSlug(body.name)
        }
        if (body.description !== undefined) updateData.description = body.description
        if (body.base_price !== undefined) updateData.base_price = parseFloat(body.base_price)
        if (body.max_guests !== undefined) updateData.max_guests = body.max_guests
        if (body.features !== undefined) updateData.features = body.features
        if (body.images !== undefined) updateData.images = body.images
        if (body.min_nights !== undefined) updateData.min_nights = body.min_nights
        if (body.is_active !== undefined) updateData.is_active = body.is_active

        const { data: room, error } = await supabase
            .from('rooms')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating room:', error)
            return NextResponse.json(
                { error: 'Failed to update room', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: room, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// DELETE - Soft delete room (set inactive)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { id } = await params
        const supabase = createAdminClient()

        // Check if room has active bookings
        const { data: bookings } = await supabase
            .from('bookings')
            .select('id')
            .eq('room_id', id)
            .eq('booking_status', 'confirmed')
            .gte('check_out', new Date().toISOString().split('T')[0])

        if (bookings && bookings.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete room with upcoming bookings', success: false },
                { status: 400 }
            )
        }

        // Soft delete - set inactive
        const { error } = await supabase
            .from('rooms')
            .update({ is_active: false })
            .eq('id', id)

        if (error) {
            console.error('Error deleting room:', error)
            return NextResponse.json(
                { error: 'Failed to delete room', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, message: 'Room deleted successfully' })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
