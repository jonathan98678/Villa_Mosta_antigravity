import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// GET - List all reviews
export async function GET() {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const supabase = createAdminClient()

        const { data: reviews, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching reviews:', error)
            return NextResponse.json(
                { error: 'Failed to fetch reviews', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: reviews, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}

// POST - Create new review
export async function POST(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const body = await request.json()
        const {
            guest_name, country, source, rating, review_text,
            review_date, is_verified, stay_type, room_type, score
        } = body

        if (!guest_name || !rating || !review_text || !review_date) {
            return NextResponse.json(
                { error: 'Guest name, rating, review text, and date are required', success: false },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        const { data: review, error } = await supabase
            .from('reviews')
            .insert({
                guest_name,
                country: country || null,
                source: source || 'Our Website',
                rating: parseInt(rating),
                review_text,
                review_date,
                is_verified: is_verified || false,
                stay_type: stay_type || null,
                room_type: room_type || null,
                score: score ? parseFloat(score) : null,
                is_featured: false,
                is_active: true
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating review:', error)
            return NextResponse.json(
                { error: 'Failed to create review', success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({ data: review, success: true }, { status: 201 })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
