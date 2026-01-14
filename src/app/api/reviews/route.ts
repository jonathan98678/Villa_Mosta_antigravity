import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const featured = searchParams.get('featured')
        const limit = searchParams.get('limit')
        const minRating = searchParams.get('minRating')

        const supabase = await createClient()

        let query = supabase
            .from('reviews')
            .select('*')
            .eq('is_active', true)
            .order('review_date', { ascending: false })

        if (featured === 'true') {
            query = query.eq('is_featured', true)
        }

        if (minRating) {
            query = query.gte('rating', parseInt(minRating))
        }

        if (limit) {
            query = query.limit(parseInt(limit))
        }

        const { data: reviews, error } = await query

        if (error) {
            console.error('Error fetching reviews:', error)
            return NextResponse.json(
                { error: 'Failed to fetch reviews', data: null, success: false },
                { status: 500 }
            )
        }

        // Calculate average rating
        const totalRating = reviews?.reduce((sum, r) => sum + r.rating, 0) || 0
        const averageRating = reviews?.length ? (totalRating / reviews.length).toFixed(1) : '0'

        return NextResponse.json({
            data: reviews,
            meta: {
                total: reviews?.length || 0,
                averageRating: parseFloat(averageRating)
            },
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
