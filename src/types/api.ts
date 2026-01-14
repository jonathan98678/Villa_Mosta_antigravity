// API request and response types

import type { Room, Booking, Review, SiteContent, FAQ, BlogPost, ContactRequest } from './database'

// Generic API response
export interface ApiResponse<T> {
    data: T | null
    error: string | null
    success: boolean
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// Room APIs
export interface CreateRoomRequest {
    name: string
    description: string
    base_price: number
    max_guests: number
    features: string[]
    images: string[]
    min_nights?: number
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {
    is_active?: boolean
}

// Booking APIs
export interface CheckAvailabilityRequest {
    roomId: string
    startDate: string
    endDate: string
}

export interface CheckAvailabilityResponse {
    isAvailable: boolean
    blockedDates: string[]
    pricePerNight: number
    totalNights: number
    totalPrice: number
}

export interface CreateBookingRequest {
    roomId: string
    checkIn: string
    checkOut: string
    guestName: string
    guestEmail: string
    guestPhone?: string
    numGuests: number
    specialRequests?: string
}

export interface CreateBookingResponse {
    booking: Booking
    clientSecret: string
}

// Review APIs
export interface CreateReviewRequest {
    guest_name: string
    country?: string
    source: Review['source']
    rating: number
    review_text: string
    review_date: string
    is_verified?: boolean
    stay_type?: string
    room_type?: string
    score?: number
}

export interface UpdateReviewRequest extends Partial<CreateReviewRequest> {
    is_featured?: boolean
    is_active?: boolean
}

// Content APIs
export interface UpdateContentRequest {
    page: string
    section: string
    content: Record<string, unknown>
}

// FAQ APIs
export interface CreateFAQRequest {
    question: string
    answer: string
    category?: string
    order_index?: number
}

export interface UpdateFAQRequest extends Partial<CreateFAQRequest> {
    is_active?: boolean
}

// Blog APIs
export interface CreateBlogRequest {
    title: string
    content: string
    excerpt: string
    featured_image?: string
    author: string
    is_published?: boolean
    meta_title?: string
    meta_description?: string
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> { }

// Contact APIs
export interface CreateContactRequest {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
}

// Admin Auth
export interface AdminLoginRequest {
    email: string
    password: string
}

export interface AdminLoginResponse {
    token: string
    admin: {
        id: string
        email: string
        name: string
        role: string
    }
}

// Upload
export interface UploadResponse {
    url: string
    path: string
}
