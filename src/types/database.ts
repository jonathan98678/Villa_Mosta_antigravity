// Database types for Supabase tables

export interface Room {
    id: string
    name: string
    slug: string
    description: string
    base_price: number
    max_guests: number
    features: string[]
    images: string[]
    is_active: boolean
    min_nights: number
    created_at: string
    updated_at: string
}

export interface Booking {
    id: string
    room_id: string
    guest_name: string
    guest_email: string
    guest_phone: string | null
    check_in: string
    check_out: string
    num_guests: number
    total_price: number
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    stripe_payment_intent_id: string | null
    booking_status: 'confirmed' | 'cancelled' | 'completed'
    special_requests: string | null
    created_at: string
    updated_at: string
    // Joined data
    room?: Room
}

export interface BlockedDate {
    id: string
    room_id: string
    start_date: string
    end_date: string
    reason: string | null
    created_at: string
}

export interface Review {
    id: string
    guest_name: string
    country: string | null
    source: 'Our Website' | 'Booking.com' | 'Airbnb' | 'Google Maps'
    rating: number
    review_text: string
    review_date: string
    is_verified: boolean
    stay_type: string | null
    room_type: string | null
    score: number | null
    is_featured: boolean
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface SiteContent {
    id: string
    page: string
    section: string
    content: Record<string, unknown>
    order_index: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface SiteSetting {
    id: string
    key: string
    value: string
    description: string | null
    created_at: string
    updated_at: string
}

export interface FAQ {
    id: string
    question: string
    answer: string
    category: string | null
    order_index: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    featured_image: string | null
    author: string
    published_at: string | null
    is_published: boolean
    meta_title: string | null
    meta_description: string | null
    created_at: string
    updated_at: string
}

export interface GalleryImage {
    id: string
    url: string
    alt_text: string
    category: string | null
    order_index: number
    is_active: boolean
    created_at: string
}

export interface ICalIntegration {
    id: string
    name: string
    ical_url: string
    room_id: string | null
    sync_frequency_minutes: number
    last_sync_at: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface ContactRequest {
    id: string
    name: string
    email: string
    phone: string | null
    subject: string
    message: string
    is_read: boolean
    is_responded: boolean
    created_at: string
}

export interface AdminUser {
    id: string
    email: string
    password_hash: string
    name: string
    role: 'admin' | 'editor'
    last_login: string | null
    created_at: string
    updated_at: string
}

// Content structures for CMS
export interface HeroContent {
    title: string
    subtitle: string
    backgroundImage: string
    backgroundVideo?: string
}

export interface HighlightItem {
    title: string
    description: string
    icon?: string
}

export interface AmenityItem {
    label: string
    icon?: string
}

export interface SpecificationCategory {
    category: string
    items: string[]
}

export interface RoomPreview {
    roomId: string
    customTitle?: string
    customDescription?: string
}

export interface CTAContent {
    title: string
    description: string
    buttonText: string
    buttonLink: string
}

export interface TransportOption {
    title: string
    description: string
    icon?: string
}

export interface DistanceItem {
    destination: string
    time: string
    method: string
}

export interface StatItem {
    label: string
    value: string
}
