import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// GET - Get content by page
export async function GET(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page') || 'home'

        const supabase = createAdminClient()

        const { data: content, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('page', page)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching content:', error)
            return NextResponse.json(
                { error: 'Failed to fetch content', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: content, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// PUT - Update or create content section
export async function PUT(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const body = await request.json()
        const { page, section, content, order_index, is_active } = body

        if (!page || !section || !content) {
            return NextResponse.json(
                { error: 'Page, section, and content are required', success: false },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Upsert - update if exists, insert if not
        const { data: updatedContent, error } = await supabase
            .from('site_content')
            .upsert({
                page,
                section,
                content,
                order_index: order_index ?? 0,
                is_active: is_active ?? true
            }, {
                onConflict: 'page,section'
            })
            .select()
            .single()

        if (error) {
            console.error('Error updating content:', error)
            return NextResponse.json(
                { error: 'Failed to update content', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: updatedContent, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
