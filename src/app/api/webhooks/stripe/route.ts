import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(request: Request) {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe signature' },
            { status: 400 }
        )
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        )
    }

    const supabase = createAdminClient()

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent

            // Update booking payment status
            const { error } = await supabase
                .from('bookings')
                .update({
                    payment_status: 'paid',
                    updated_at: new Date().toISOString()
                })
                .eq('stripe_payment_intent_id', paymentIntent.id)

            if (error) {
                console.error('Error updating booking after payment:', error)
            }

            // TODO: Send confirmation email to guest
            console.log('Payment succeeded for:', paymentIntent.id)
            break
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent

            // Update booking payment status
            const { error } = await supabase
                .from('bookings')
                .update({
                    payment_status: 'failed',
                    updated_at: new Date().toISOString()
                })
                .eq('stripe_payment_intent_id', paymentIntent.id)

            if (error) {
                console.error('Error updating booking after payment failure:', error)
            }

            console.log('Payment failed for:', paymentIntent.id)
            break
        }

        case 'charge.refunded': {
            const charge = event.data.object as Stripe.Charge

            if (charge.payment_intent) {
                const { error } = await supabase
                    .from('bookings')
                    .update({
                        payment_status: 'refunded',
                        booking_status: 'cancelled',
                        updated_at: new Date().toISOString()
                    })
                    .eq('stripe_payment_intent_id', charge.payment_intent as string)

                if (error) {
                    console.error('Error updating booking after refund:', error)
                }
            }
            break
        }

        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}

// Disable body parsing for webhook
export const config = {
    api: {
        bodyParser: false,
    },
}
