import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// PUT - Update review
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

        if (body.guest_name !== undefined) updateData.guest_name = body.guest_name
        if (body.country !== undefined) updateData.country = body.country
        if (body.source !== undefined) updateData.source = body.source
        if (body.rating !== undefined) updateData.rating = parseInt(body.rating)
        if (body.review_text !== undefined) updateData.review_text = body.review_text
        if (body.review_date !== undefined) updateData.review_date = body.review_date
        if (body.is_verified !== undefined) updateData.is_verified = body.is_verified
        if (body.stay_type !== undefined) updateData.stay_type = body.stay_type
        if (body.room_type !== undefined) updateData.room_type = body.room_type
        if (body.score !== undefined) updateData.score = body.score ? parseFloat(body.score) : null
        if (body.is_featured !== undefined) updateData.is_featured = body.is_featured
        if (body.is_active !== undefined) updateData.is_active = body.is_active

        const { data: review, error } = await supabase
            .from('reviews')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating review:', error)
            return NextResponse.json(
                { error: 'Failed to update review', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: review, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// DELETE - Delete review
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { id } = await params
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting review:', error)
            return NextResponse.json(
                { error: 'Failed to delete review', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, message: 'Review deleted successfully' })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
