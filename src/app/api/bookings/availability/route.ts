import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateNights, calculateTotalPrice } from '@/lib/utils'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const roomId = searchParams.get('roomId')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        // Validate required params
        if (!roomId || !startDate || !endDate) {
            return NextResponse.json(
                { error: 'Missing required parameters: roomId, startDate, endDate', data: null, success: false },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Get room details
        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select('*')
            .eq('id', roomId)
            .eq('is_active', true)
            .single()

        if (roomError || !room) {
            return NextResponse.json(
                { error: 'Room not found', data: null, success: false },
                { status: 404 }
            )
        }

        // Check for overlapping bookings
        const { data: existingBookings, error: bookingError } = await supabase
            .from('bookings')
            .select('check_in, check_out')
            .eq('room_id', roomId)
            .neq('booking_status', 'cancelled')
            .or(`and(check_in.lte.${endDate},check_out.gt.${startDate})`)

        if (bookingError) {
            console.error('Error checking bookings:', bookingError)
            return NextResponse.json(
                { error: 'Failed to check availability', data: null, success: false },
                { status: 500 }
            )
        }

        // Check for blocked dates
        const { data: blockedDates, error: blockedError } = await supabase
            .from('blocked_dates')
            .select('start_date, end_date')
            .eq('room_id', roomId)
            .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`)

        if (blockedError) {
            console.error('Error checking blocked dates:', blockedError)
        }

        // Determine availability
        const hasConflicts = (existingBookings && existingBookings.length > 0) ||
            (blockedDates && blockedDates.length > 0)

        // Calculate pricing
        const nights = calculateNights(startDate, endDate)

        // Check minimum nights
        if (nights < room.min_nights) {
            return NextResponse.json({
                data: {
                    isAvailable: false,
                    reason: `Minimum stay is ${room.min_nights} nights`,
                    blockedDates: [],
                    pricePerNight: room.base_price,
                    totalNights: nights,
                    totalPrice: 0
                },
                error: null,
                success: true
            })
        }

        // Get booking fee from settings
        const { data: feeSettings } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'booking_fee')
            .single()

        const bookingFee = feeSettings ? parseFloat(feeSettings.value) : 0
        const totalPrice = calculateTotalPrice(room.base_price, nights, bookingFee)

        // Collect all blocked date ranges
        const allBlockedDates: string[] = []

        existingBookings?.forEach((booking) => {
            allBlockedDates.push(`${booking.check_in} to ${booking.check_out}`)
        })

        blockedDates?.forEach((blocked) => {
            allBlockedDates.push(`${blocked.start_date} to ${blocked.end_date}`)
        })

        return NextResponse.json({
            data: {
                isAvailable: !hasConflicts,
                blockedDates: allBlockedDates,
                pricePerNight: room.base_price,
                totalNights: nights,
                totalPrice,
                bookingFee,
                minNights: room.min_nights
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
