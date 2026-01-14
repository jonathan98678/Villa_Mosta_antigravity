import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth'

// GET - List all bookings with room details
export async function GET(request: Request) {
    const admin = await verifyAdminAuth()
    if (!admin) return unauthorizedResponse()

    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const roomId = searchParams.get('roomId')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        const supabase = createAdminClient()

        let query = supabase
            .from('bookings')
            .select(`
        *,
        room:rooms(id, name, slug)
      `)
            .order('created_at', { ascending: false })

        if (status) {
            query = query.eq('booking_status', status)
        }

        if (roomId) {
            query = query.eq('room_id', roomId)
        }

        if (startDate) {
            query = query.gte('check_in', startDate)
        }

        if (endDate) {
            query = query.lte('check_out', endDate)
        }

        const { data: bookings, error } = await query

        if (error) {
            console.error('Error fetching bookings:', error)
            return NextResponse.json(
                { error: 'Failed to fetch bookings', success: false },
                { status: 500 }
            )
        }

        // Calculate summary stats
        const totalRevenue = bookings
            ?.filter(b => b.payment_status === 'paid')
            .reduce((sum, b) => sum + parseFloat(b.total_price), 0) || 0

        const stats = {
            total: bookings?.length || 0,
            confirmed: bookings?.filter(b => b.booking_status === 'confirmed').length || 0,
            completed: bookings?.filter(b => b.booking_status === 'completed').length || 0,
            cancelled: bookings?.filter(b => b.booking_status === 'cancelled').length || 0,
            totalRevenue
        }

        return NextResponse.json({ data: bookings, stats, success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    }
}
