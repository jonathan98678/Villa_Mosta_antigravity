import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Users, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

async function getRooms() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true)
        .order('base_price', { ascending: true })

    return data || []
}

export default async function RoomsPage() {
    const rooms = await getRooms()

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <section className="py-24 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
                        Our Rooms
                    </h1>
                    <p className="text-xl text-neutral-400">
                        Choose from our collection of thoughtfully designed accommodations, each offering a unique experience.
                    </p>
                </div>
            </section>

            {/* Rooms Grid */}
            <section className="py-24 bg-neutral-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {rooms.map((room) => (
                            <div key={room.id} className="group bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all">
                                {/* Image */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <div className="absolute inset-0 bg-neutral-800" />
                                    {room.images?.[0] && (
                                        <Image
                                            src={room.images[0]}
                                            alt={room.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="font-serif text-2xl text-white group-hover:text-amber-500 transition-colors">
                                            {room.name}
                                        </h2>
                                        <div className="text-right">
                                            <p className="text-2xl font-medium text-amber-500">
                                                {formatPrice(room.base_price)}
                                            </p>
                                            <p className="text-neutral-500 text-sm">per night</p>
                                        </div>
                                    </div>

                                    <p className="text-neutral-400 line-clamp-2 mb-6">
                                        {room.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-neutral-400 mb-6">
                                        <span className="flex items-center gap-2">
                                            <Users size={16} />
                                            Up to {room.max_guests} guests
                                        </span>
                                        {room.min_nights > 1 && (
                                            <span>Min. {room.min_nights} nights</span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {room.features.slice(0, 4).map((feature: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 text-xs">
                                                {feature}
                                            </span>
                                        ))}
                                        {room.features.length > 4 && (
                                            <span className="px-3 py-1 bg-neutral-900 text-neutral-500 rounded-full text-xs">
                                                +{room.features.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <Link
                                            href={`/rooms/${room.id}`}
                                            className="flex-1 px-6 py-3 border border-neutral-700 text-white text-center rounded-lg hover:bg-neutral-800 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href={`/book?room=${room.id}`}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Book Now
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {rooms.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            No rooms available at the moment.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
