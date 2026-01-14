import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// GET - List all FAQs
export async function GET() {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const supabase = createAdminClient()

        const { data: faqs, error } = await supabase
            .from('faqs')
            .select('*')
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching FAQs:', error)
            return NextResponse.json(
                { error: 'Failed to fetch FAQs', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: faqs, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// POST - Create FAQ
export async function POST(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const body = await request.json()
        const { question, answer, category, order_index } = body

        if (!question || !answer) {
            return NextResponse.json(
                { error: 'Question and answer are required', success: false },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Get max order_index if not provided
        let finalOrderIndex = order_index
        if (finalOrderIndex === undefined) {
            const { data: maxFaq } = await supabase
                .from('faqs')
                .select('order_index')
                .order('order_index', { ascending: false })
                .limit(1)
                .single()

            finalOrderIndex = (maxFaq?.order_index || 0) + 1
        }

        const { data: faq, error } = await supabase
            .from('faqs')
            .insert({
                question,
                answer,
                category: category || null,
                order_index: finalOrderIndex,
                is_active: true
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating FAQ:', error)
            return NextResponse.json(
                { error: 'Failed to create FAQ', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: faq, success: true }, { status: 201 })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
