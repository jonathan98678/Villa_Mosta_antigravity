import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Wifi, Lock, Sparkles, ArrowRight, Users, Calendar } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import HomeClient from './HomeClient'

async function getHomeContent() {
    try {
        const supabase = await createClient()
        const [contentRes, roomsRes, reviewsRes] = await Promise.all([
            supabase.from('site_content').select('*').in('section', ['home', 'hero', 'amenities']),
            supabase.from('rooms').select('*').eq('is_active', true).order('base_price').limit(3),
            supabase.from('reviews').select('*').eq('is_featured', true).eq('is_approved', true).limit(3)
        ])
        return {
            content: contentRes.data || [],
            rooms: roomsRes.data || [],
            reviews: reviewsRes.data || []
        }
    } catch {
        return { content: [], rooms: [], reviews: [] }
    }
}

// Default content when CMS is empty - Villa Mosta Malta
const defaultContent = {
    hero: {
        title: 'Your Home in the Heart of Malta',
        subtitle: 'Villa Mosta',
        description: 'Experience authentic Maltese hospitality in our charming 3-bedroom villa. Perfectly located near the famous Mosta Rotunda, with sun terrace, free WiFi, and stunning city views.',
        image: '/hero-villa.jpg'
    },
    stats: [
        { value: '3', label: 'Elegant Rooms' },
        { value: '9.5', label: 'Guest Rating' },
        { value: '6.8mi', label: 'To Airport' },
        { value: '24/7', label: 'Support' }
    ],
    amenities: [
        { icon: 'Wifi', title: 'Free High-Speed WiFi', description: 'Stay connected throughout your entire stay' },
        { icon: 'Lock', title: 'Private & Secure', description: 'Express check-in/out with luggage storage' },
        { icon: 'Sparkles', title: 'Air Conditioning', description: 'Climate control in all rooms for your comfort' },
        { icon: 'MapPin', title: 'Central Location', description: 'Walking distance to Mosta Rotunda & restaurants' }
    ]
}

export default async function HomePage() {
    const { content, rooms, reviews } = await getHomeContent()

    // Parse CMS content or use defaults
    const heroContent = content.find(c => c.section === 'hero')?.content || defaultContent.hero
    const homeContent = content.find(c => c.section === 'home')?.content || {}

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
                    <div className="absolute inset-0 bg-radial-top opacity-50" />
                    <div className="absolute inset-0 decorative-grid opacity-30" />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float delay-200" />

                {/* Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
                    <span className="inline-block text-amber-500 text-sm tracking-[0.3em] uppercase mb-6 animate-slide-down">
                        {heroContent.subtitle || 'Welcome'}
                    </span>

                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight animate-slide-up delay-100">
                        {heroContent.title || 'A Sanctuary of Luxury'}
                    </h1>

                    <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up delay-200">
                        {heroContent.description || defaultContent.hero.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
                        <Link href="/book" className="btn-primary inline-flex items-center justify-center gap-2">
                            Book Your Stay
                            <ArrowRight size={20} />
                        </Link>
                        <Link href="/rooms" className="btn-secondary inline-flex items-center justify-center gap-2">
                            Explore Rooms
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
                    <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-amber-500 rounded-full animate-slide-down" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-neutral-900/50 border-y border-neutral-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {(homeContent.stats || defaultContent.stats).map((stat: { value: string; label: string }, i: number) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl md:text-5xl font-serif text-amber-500 mb-2">{stat.value}</div>
                                <div className="text-neutral-400 uppercase tracking-wider text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="section-lg bg-neutral-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-center opacity-30" />
                <div className="max-w-6xl mx-auto px-6 relative">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block">About Villa Mosta</span>
                            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
                                {homeContent.aboutTitle || 'Authentic Maltese Hospitality'}
                            </h2>
                            <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                                {homeContent.aboutDescription || 'Located in the charming town of Mosta, our villa offers the perfect base for exploring Malta. Enjoy city views from your private balcony, relax on our sun terrace, and discover why guests rate us 9.5 out of 10.'}
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="accent-line" />
                                <Link href="/villa" className="text-amber-500 hover:text-amber-400 inline-flex items-center gap-2 transition-colors">
                                    Discover Our Story <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-800 relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent z-10" />
                                {/* Placeholder for image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-neutral-900" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-neutral-900 border border-neutral-800 rounded-xl p-6 glass">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                                        <Star className="text-amber-500" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-serif text-white">9.5</div>
                                        <div className="text-neutral-400 text-sm">Booking.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms Preview */}
            {rooms.length > 0 && (
                <section className="section-lg bg-neutral-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block">Accommodations</span>
                            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Our Signature Rooms</h2>
                            <p className="text-neutral-400 max-w-2xl mx-auto">Each space has been thoughtfully designed for comfort and style</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {rooms.map((room, i) => (
                                <Link
                                    key={room.id}
                                    href={`/rooms/${room.id}`}
                                    className="group bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover-lift hover:border-amber-500/30 transition-all"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden bg-neutral-800">
                                        {room.images?.[0] && (
                                            <Image
                                                src={room.images[0]}
                                                alt={room.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent opacity-60" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-serif text-2xl text-white group-hover:text-amber-500 transition-colors mb-2">
                                            {room.name}
                                        </h3>
                                        <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{room.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                                <span className="flex items-center gap-1"><Users size={14} /> {room.max_guests}</span>
                                            </div>
                                            <div className="text-amber-500 font-medium">
                                                {formatPrice(room.base_price)}<span className="text-neutral-500 text-sm">/night</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/rooms" className="btn-secondary inline-flex items-center gap-2">
                                View All Rooms <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Amenities */}
            <section className="section-lg bg-neutral-950 relative">
                <div className="absolute inset-0 bg-radial-top opacity-30" />
                <div className="max-w-6xl mx-auto px-6 relative">
                    <div className="text-center mb-16">
                        <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block">Amenities</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Everything You Need</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {defaultContent.amenities.map((amenity, i) => {
                            const IconComponent = { Wifi, Lock, Sparkles, MapPin }[amenity.icon] || Sparkles
                            return (
                                <div key={i} className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-amber-500/30 transition-colors group">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                                        <IconComponent className="text-amber-500" size={24} />
                                    </div>
                                    <h3 className="text-white font-medium mb-2">{amenity.title}</h3>
                                    <p className="text-neutral-400 text-sm">{amenity.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Reviews */}
            {reviews.length > 0 && (
                <section className="section-lg bg-neutral-900">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
                            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Guest Experiences</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="p-8 bg-neutral-950 border border-neutral-800 rounded-2xl">
                                    <div className="flex items-center gap-1 mb-6">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} size={16} className={j < review.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-700'} />
                                        ))}
                                    </div>
                                    <p className="text-neutral-300 mb-6 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                                    <div>
                                        <div className="text-white font-medium">{review.guest_name}</div>
                                        <div className="text-neutral-500 text-sm">{review.source || 'Direct Booking'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/reviews" className="btn-secondary inline-flex items-center gap-2">
                                Read All Reviews <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="section-lg bg-neutral-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-orange-900/20" />
                <div className="absolute inset-0 decorative-grid opacity-20" />

                <div className="max-w-4xl mx-auto px-6 text-center relative">
                    <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
                        Ready to Experience Malta?
                    </h2>
                    <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
                        Book your stay at Villa Mosta and discover authentic Maltese charm, just minutes from the famous Rotunda.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/book" className="btn-primary inline-flex items-center justify-center gap-2 hover-glow">
                            <Calendar size={20} />
                            Check Availability
                        </Link>
                        <Link href="/contact" className="btn-secondary inline-flex items-center justify-center gap-2">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Client-side scroll animations */}
            <HomeClient />
        </div>
    )
}
