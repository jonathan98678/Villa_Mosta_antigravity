import { createClient } from '@/lib/supabase/server'
import { Star } from 'lucide-react'
import { formatDate } from '@/lib/utils'

async function getReviews() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('review_date', { ascending: false })

    return data || []
}

export default async function ReviewsPage() {
    const reviews = await getReviews()

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0'

    const featuredReviews = reviews.filter(r => r.is_featured)
    const otherReviews = reviews.filter(r => !r.is_featured)

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <section className="py-24 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="flex justify-center gap-1 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={28} className="text-amber-400 fill-amber-400" />
                        ))}
                    </div>
                    <p className="text-5xl font-serif text-amber-500 mb-2">{avgRating}</p>
                    <p className="text-neutral-400 mb-8">{reviews.length} guest reviews</p>
                    <h1 className="font-serif text-5xl md:text-6xl text-white">
                        What Our Guests Say
                    </h1>
                </div>
            </section>

            {/* Featured Reviews */}
            {featuredReviews.length > 0 && (
                <section className="py-24 bg-neutral-900">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="font-serif text-3xl text-white mb-12 text-center">
                            Featured Reviews
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredReviews.map((review) => (
                                <div key={review.id} className="p-8 bg-neutral-950 border border-amber-500/30 rounded-2xl">
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-neutral-200 leading-relaxed mb-6">
                                        &ldquo;{review.review_text}&rdquo;
                                    </p>
                                    <div className="border-t border-neutral-800 pt-4">
                                        <p className="text-white font-medium">{review.guest_name}</p>
                                        <div className="flex items-center gap-2 text-neutral-500 text-sm mt-1">
                                            {review.country && <span>{review.country}</span>}
                                            {review.country && review.stay_type && <span>·</span>}
                                            {review.stay_type && <span>{review.stay_type}</span>}
                                        </div>
                                        <p className="text-neutral-500 text-sm mt-1">
                                            {review.source} · {formatDate(review.review_date)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Reviews */}
            <section className="py-24 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="font-serif text-3xl text-white mb-12 text-center">
                        All Reviews
                    </h2>
                    <div className="space-y-6">
                        {otherReviews.map((review) => (
                            <div key={review.id} className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-amber-500 font-medium text-lg">
                                                {review.guest_name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{review.guest_name}</p>
                                            <p className="text-neutral-500 text-sm">
                                                {review.country && `${review.country} · `}
                                                {review.stay_type && `${review.stay_type} · `}
                                                {formatDate(review.review_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-neutral-300 leading-relaxed">
                                    {review.review_text}
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="px-2 py-1 bg-neutral-800 rounded text-neutral-500 text-xs">
                                        {review.source}
                                    </span>
                                    {review.room_type && (
                                        <span className="px-2 py-1 bg-neutral-800 rounded text-neutral-500 text-xs">
                                            {review.room_type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {reviews.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            No reviews yet. Be the first to share your experience!
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
