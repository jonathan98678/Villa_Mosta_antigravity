import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: faqs, error } = await supabase
            .from('faqs')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching FAQs:', error)
            return NextResponse.json(
                { error: 'Failed to fetch FAQs', data: null, success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({
            data: faqs,
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
