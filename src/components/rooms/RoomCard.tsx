import Link from 'next/link'
import Image from 'next/image'
import { Users, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface RoomCardProps {
    id: string
    name: string
    description: string
    base_price: number
    max_guests: number
    images: string[]
    features?: string[]
}

export default function RoomCard({
    id,
    name,
    description,
    base_price,
    max_guests,
    images,
    features = []
}: RoomCardProps) {
    return (
        <Link
            href={`/rooms/${id}`}
            className="group bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover-lift hover:border-amber-500/30 transition-all"
        >
            {/* Image */}
            <div className="aspect-[16/10] relative overflow-hidden bg-neutral-800">
                {images?.[0] && (
                    <Image
                        src={images[0]}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-2xl text-white group-hover:text-amber-500 transition-colors">
                        {name}
                    </h3>
                    <div className="text-right">
                        <p className="text-xl font-medium text-amber-500">
                            {formatPrice(base_price)}
                        </p>
                        <p className="text-neutral-500 text-xs">per night</p>
                    </div>
                </div>

                <p className="text-neutral-400 text-sm line-clamp-2 mb-4">
                    {description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Users size={16} />
                        <span>Up to {max_guests} guests</span>
                    </div>
                    <span className="text-amber-500 flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                        View Details <ArrowRight size={16} />
                    </span>
                </div>

                {features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-800">
                        {features.slice(0, 3).map((feature, i) => (
                            <span key={i} className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 text-xs">
                                {feature}
                            </span>
                        ))}
                        {features.length > 3 && (
                            <span className="px-2 py-1 text-neutral-500 text-xs">
                                +{features.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    )
}
