import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'
import { calculateNights, calculateTotalPrice } from '@/lib/utils'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            roomId,
            checkIn,
            checkOut,
            guestName,
            guestEmail,
            guestPhone,
            numGuests,
            specialRequests
        } = body

        // Validate required fields
        if (!roomId || !checkIn || !checkOut || !guestName || !guestEmail || !numGuests) {
            return NextResponse.json(
                { error: 'Missing required fields', data: null, success: false },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

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

        // Validate guest count
        if (numGuests > room.max_guests) {
            return NextResponse.json(
                { error: `Maximum ${room.max_guests} guests allowed for this room`, data: null, success: false },
                { status: 400 }
            )
        }

        // Validate dates
        const checkInDate = new Date(checkIn)
        const checkOutDate = new Date(checkOut)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (checkInDate < today) {
            return NextResponse.json(
                { error: 'Check-in date cannot be in the past', data: null, success: false },
                { status: 400 }
            )
        }

        if (checkOutDate <= checkInDate) {
            return NextResponse.json(
                { error: 'Check-out must be after check-in', data: null, success: false },
                { status: 400 }
            )
        }

        // Check minimum nights
        const nights = calculateNights(checkIn, checkOut)
        if (nights < room.min_nights) {
            return NextResponse.json(
                { error: `Minimum stay is ${room.min_nights} nights`, data: null, success: false },
                { status: 400 }
            )
        }

        // Double-check availability
        const { data: existingBookings } = await supabase
            .from('bookings')
            .select('id')
            .eq('room_id', roomId)
            .neq('booking_status', 'cancelled')
            .or(`and(check_in.lte.${checkOut},check_out.gt.${checkIn})`)

        if (existingBookings && existingBookings.length > 0) {
            return NextResponse.json(
                { error: 'Selected dates are no longer available', data: null, success: false },
                { status: 409 }
            )
        }

        // Get booking fee
        const { data: feeSettings } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'booking_fee')
            .single()

        const bookingFee = feeSettings ? parseFloat(feeSettings.value) : 0
        const totalPrice = calculateTotalPrice(room.base_price, nights, bookingFee)

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100), // Stripe uses cents
            currency: 'eur',
            metadata: {
                roomId,
                roomName: room.name,
                checkIn,
                checkOut,
                guestName,
                guestEmail,
                nights: nights.toString()
            },
            receipt_email: guestEmail,
        })

        // Create booking record
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                room_id: roomId,
                guest_name: guestName,
                guest_email: guestEmail,
                guest_phone: guestPhone || null,
                check_in: checkIn,
                check_out: checkOut,
                num_guests: numGuests,
                total_price: totalPrice,
                payment_status: 'pending',
                stripe_payment_intent_id: paymentIntent.id,
                booking_status: 'confirmed',
                special_requests: specialRequests || null
            })
            .select()
            .single()

        if (bookingError) {
            console.error('Error creating booking:', bookingError)
            // Cancel the payment intent if booking creation fails
            await stripe.paymentIntents.cancel(paymentIntent.id)
            return NextResponse.json(
                { error: 'Failed to create booking', data: null, success: false },
                { status: 500 }
            )
        }

        return NextResponse.json({
            data: {
                booking,
                clientSecret: paymentIntent.client_secret
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
