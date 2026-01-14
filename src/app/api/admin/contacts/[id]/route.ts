import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// PUT - Mark contact as read/responded
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

        if (body.is_read !== undefined) updateData.is_read = body.is_read
        if (body.is_responded !== undefined) updateData.is_responded = body.is_responded

        const { data: contact, error } = await supabase
            .from('contact_requests')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating contact:', error)
            return NextResponse.json(
                { error: 'Failed to update contact request', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: contact, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// DELETE - Delete contact request
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
            .from('contact_requests')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting contact:', error)
            return NextResponse.json(
                { error: 'Failed to delete contact request', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, message: 'Contact request deleted' })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
