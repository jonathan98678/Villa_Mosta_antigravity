import Stripe from 'stripe'

// Lazy initialization to avoid errors during build when env vars aren't available
let stripeInstance: Stripe | null = null

export const getStripe = () => {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not defined')
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover',
            typescript: true,
        })
    }
    return stripeInstance
}

// Keep backward compatibility
export const stripe = {
    get paymentIntents() {
        return getStripe().paymentIntents
    },
    get webhooks() {
        return getStripe().webhooks
    },
}

export const getStripePublishableKey = () => {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
}
