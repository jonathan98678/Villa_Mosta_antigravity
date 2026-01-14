import { Star, Quote } from 'lucide-react'

interface ReviewCardProps {
    guest_name: string
    rating: number
    text: string
    source?: string
    stay_date?: string
}

export default function ReviewCard({
    guest_name,
    rating,
    text,
    source,
    stay_date
}: ReviewCardProps) {
    return (
        <div className="p-6 md:p-8 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-amber-500/20 transition-colors">
            {/* Quote icon */}
            <Quote size={32} className="text-amber-500/30 mb-4" />

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={i < rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-700'}
                    />
                ))}
            </div>

            {/* Review text */}
            <p className="text-neutral-300 leading-relaxed mb-6">
                &ldquo;{text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-white font-medium">{guest_name}</div>
                    {stay_date && (
                        <div className="text-neutral-500 text-sm">{stay_date}</div>
                    )}
                </div>
                {source && (
                    <span className="px-2 py-1 bg-neutral-800 rounded text-neutral-400 text-xs">
                        {source}
                    </span>
                )}
            </div>
        </div>
    )
}
