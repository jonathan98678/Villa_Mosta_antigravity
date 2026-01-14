import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Calendar, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

async function getRoom(id: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

    return data
}

async function getOtherRooms(excludeId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('rooms')
        .select('id, name, base_price, images')
        .eq('is_active', true)
        .neq('id', excludeId)
        .limit(3)

    return data || []
}

export default async function RoomDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const [room, otherRooms] = await Promise.all([
        getRoom(id),
        getOtherRooms(id)
    ])

    if (!room) {
        notFound()
    }

    return (
        <div className="min-h-screen pt-20">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <Link
                    href="/rooms"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Rooms
                </Link>
            </div>

            {/* Main Content */}
            <section className="pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-neutral-800" />
                                {room.images?.[0] && (
                                    <Image
                                        src={room.images[0]}
                                        alt={room.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                )}
                            </div>
                            {room.images && room.images.length > 1 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {room.images.slice(1, 4).map((img: string, i: number) => (
                                        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                                            <Image
                                                src={img}
                                                alt={`${room.name} ${i + 2}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
                                {room.name}
                            </h1>

                            <div className="flex items-center gap-4 text-neutral-400 mb-6">
                                <span className="flex items-center gap-2">
                                    <Users size={18} />
                                    Up to {room.max_guests} guests
                                </span>
                                {room.min_nights > 1 && (
                                    <span className="flex items-center gap-2">
                                        <Calendar size={18} />
                                        Min. {room.min_nights} nights
                                    </span>
                                )}
                            </div>

                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl font-medium text-amber-500">
                                    {formatPrice(room.base_price)}
                                </span>
                                <span className="text-neutral-400">per night</span>
                            </div>

                            <p className="text-neutral-300 leading-relaxed mb-8">
                                {room.description}
                            </p>

                            {/* Features */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-white mb-4">Amenities & Features</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {room.features.map((feature: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                                                <Check size={12} className="text-amber-500" />
                                            </div>
                                            <span className="text-neutral-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                                <p className="text-neutral-400 text-sm mb-4">
                                    Ready to book your stay?
                                </p>
                                <Link
                                    href={`/book?room=${room.id}`}
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                                >
                                    Book This Room
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Rooms */}
            {otherRooms.length > 0 && (
                <section className="py-24 bg-neutral-900 border-t border-neutral-800">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="font-serif text-3xl text-white mb-8">Other Rooms</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {otherRooms.map((r) => (
                                <Link
                                    key={r.id}
                                    href={`/rooms/${r.id}`}
                                    className="group"
                                >
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                                        <div className="absolute inset-0 bg-neutral-800" />
                                        {r.images?.[0] && (
                                            <Image
                                                src={r.images[0]}
                                                alt={r.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <h3 className="text-white font-medium group-hover:text-amber-500 transition-colors">
                                        {r.name}
                                    </h3>
                                    <p className="text-amber-500">
                                        From {formatPrice(r.base_price)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
