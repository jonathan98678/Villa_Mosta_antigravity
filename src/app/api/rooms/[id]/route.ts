import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data: room, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single()

        if (error || !room) {
            return NextResponse.json(
                { error: 'Room not found', data: null, success: false },
                { status: 404 }
            )
        }

        return NextResponse.json({
            data: room,
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
