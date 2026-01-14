import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

// GET - List all rooms (including inactive for admin)
export async function GET() {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const supabase = createAdminClient()

        const { data: rooms, error } = await supabase
            .from('rooms')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching rooms:', error)
            return NextResponse.json(
                { error: 'Failed to fetch rooms', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: rooms, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// POST - Create new room
export async function POST(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const body = await request.json()
        const { name, description, base_price, max_guests, features, images, min_nights } = body

        if (!name || !description || !base_price) {
            return NextResponse.json(
                { error: 'Name, description, and base price are required', success: false },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        const { data: room, error } = await supabase
            .from('rooms')
            .insert({
                name,
                slug: generateSlug(name),
                description,
                base_price: parseFloat(base_price),
                max_guests: max_guests || 2,
                features: features || [],
                images: images || [],
                min_nights: min_nights || 1,
                is_active: true
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating room:', error)
            return NextResponse.json(
                { error: 'Failed to create room', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: room, success: true }, { status: 201 })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
