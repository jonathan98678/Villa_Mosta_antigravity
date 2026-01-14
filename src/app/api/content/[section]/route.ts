import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ section: string }> }
) {
    try {
        const { section } = await params
        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page') || 'home'

        const supabase = await createClient()

        const { data: content, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('page', page)
            .eq('section', section)
            .eq('is_active', true)
            .single()

        if (error || !content) {
            return NextResponse.json(
                { error: 'Content not found', data: null, success: false },
                { status: 404 }
            )
        }

        return NextResponse.json({
            data: content.content,
            error: null,
            success: true
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', data: null, success: false },
            { status: 500 }
        )
    }
}
