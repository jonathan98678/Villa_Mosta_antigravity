import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: rooms, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching rooms:', error)
            return NextResponse.json(
                { error: 'Failed to fetch rooms', data: null, success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({
            data: rooms,
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
