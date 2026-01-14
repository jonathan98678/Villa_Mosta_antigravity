import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// PUT - Update FAQ
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

        if (body.question !== undefined) updateData.question = body.question
        if (body.answer !== undefined) updateData.answer = body.answer
        if (body.category !== undefined) updateData.category = body.category
        if (body.order_index !== undefined) updateData.order_index = body.order_index
        if (body.is_active !== undefined) updateData.is_active = body.is_active

        const { data: faq, error } = await supabase
            .from('faqs')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating FAQ:', error)
            return NextResponse.json(
                { error: 'Failed to update FAQ', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: faq, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// DELETE - Delete FAQ
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
            .from('faqs')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting FAQ:', error)
            return NextResponse.json(
                { error: 'Failed to delete FAQ', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, message: 'FAQ deleted successfully' })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
