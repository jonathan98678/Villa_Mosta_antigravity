import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

export function formatPrice(price: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(price)
}

export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date

    if (format === 'long') {
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
    const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
    const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function calculateTotalPrice(
    basePrice: number,
    nights: number,
    fees: number = 0
): number {
    return basePrice * nights + fees
}

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
}

export function getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
}

export function isDateInPast(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today
}

export function getAverageRating(ratings: number[]): number {
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, rating) => acc + rating, 0)
    return Math.round((sum / ratings.length) * 10) / 10
}
