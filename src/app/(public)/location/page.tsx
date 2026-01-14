import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Star, Home, MapPin, Car, Plane, Clock, ArrowRight } from 'lucide-react'

async function getLocationContent() {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('site_content')
            .select('*')
            .eq('section', 'location')
            .single()
        return data?.content || null
    } catch {
        return null
    }
}

const defaultContent = {
    title: 'Heart of Malta',
    subtitle: 'Mosta, Malta',
    description: 'Villa Mosta is perfectly situated in the charming town of Mosta, offering easy access to Malta\'s top attractions while enjoying peaceful residential surroundings.',
    address: {
        street: '51 Triq Il-Kungress Ewkaristiku',
        city: 'Mosta, MST 9032',
        country: 'Malta'
    },
    highlights: [
        { icon: 'Church', title: 'Mosta Rotunda', description: '5-minute walk to the famous dome - 3rd largest unsupported in the world' },
        { icon: 'Restaurant', title: 'Local Dining', description: 'Traditional Maltese restaurants and cafes within walking distance' },
        { icon: 'Shop', title: 'Town Center', description: 'Shops, markets, and local boutiques nearby' },
        { icon: 'Nature', title: 'Ta\' Bistra Catacombs', description: 'Ancient 4th century burial chambers just outside town' }
    ],
    transportation: [
        { icon: 'Plane', title: 'Malta Airport', distance: '6.8 mi', description: 'Approximately 20 minutes by car or taxi' },
        { icon: 'Car', title: 'Valletta', distance: '15 min', description: 'Easy access to the capital city and Grand Harbour' },
        { icon: 'Clock', title: 'Mdina', distance: '10 min', description: 'The Silent City and medieval architecture' }
    ]
}

export default async function LocationPage() {
    const cmsContent = await getLocationContent()
    const content = cmsContent || defaultContent

    return (
        <div className="min-h-screen pt-20">
            {/* Hero */}
            <section className="relative py-32 bg-neutral-950 overflow-hidden">
                <div className="absolute inset-0 bg-radial-top opacity-40" />
                <div className="absolute inset-0 decorative-grid opacity-20" />

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block animate-slide-down">
                        {content.subtitle || 'Our Neighborhood'}
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 animate-slide-up delay-100">
                        {content.title || 'Prime Location'}
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto animate-slide-up delay-200">
                        {content.description}
                    </p>
                </div>
            </section>

            {/* Address */}
            <section className="py-16 bg-neutral-900/50 border-y border-neutral-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                                <MapPin className="text-amber-500" size={24} />
                            </div>
                            <div>
                                <p className="text-white font-medium">{content.address?.street || '51 Triq Il-Kungress Ewkaristiku'}</p>
                                <p className="text-neutral-400">{content.address?.city || 'Mosta, MST 9032'}, {content.address?.country || 'Malta'}</p>
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-neutral-800" />
                        <a
                            href="#"
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            <MapPin size={18} />
                            View on Map
                        </a>
                    </div>
                </div>
            </section>

            {/* Neighborhood Highlights */}
            <section className="section-lg bg-neutral-950">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block">Explore</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">The Neighborhood</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">Everything you need is just moments away</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(content.highlights || defaultContent.highlights).map((highlight: { title: string; description: string }, i: number) => (
                            <div
                                key={i}
                                className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-amber-500/30 transition-all group hover-lift"
                            >
                                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                                    <Star className="text-amber-500" size={24} />
                                </div>
                                <h3 className="text-white font-medium mb-2">{highlight.title}</h3>
                                <p className="text-neutral-400 text-sm">{highlight.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transportation */}
            <section className="section-lg bg-neutral-900">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block">Getting Here</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Transportation</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {(content.transportation || defaultContent.transportation).map((item: { title: string; distance: string; description: string; icon: string }, i: number) => {
                            const IconComponent = { Plane, Car, Clock }[item.icon] || Clock
                            return (
                                <div key={i} className="text-center p-8 bg-neutral-950 border border-neutral-800 rounded-2xl">
                                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <IconComponent className="text-amber-500" size={32} />
                                    </div>
                                    <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                                    <div className="text-3xl font-serif text-amber-500 mb-2">{item.distance}</div>
                                    <p className="text-neutral-400 text-sm">{item.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="section bg-neutral-950 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="aspect-[16/9] md:aspect-[21/9] bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="text-neutral-700 mx-auto mb-4" size={48} />
                            <p className="text-neutral-500">Interactive map coming soon</p>
                            <p className="text-neutral-600 text-sm mt-2">Configure Google Maps API key in settings</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-lg bg-neutral-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-orange-900/10" />

                <div className="max-w-4xl mx-auto px-6 text-center relative">
                    <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
                        Ready to Visit?
                    </h2>
                    <p className="text-xl text-neutral-400 mb-10">
                        Book your stay and experience our perfect location firsthand.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/book" className="btn-primary inline-flex items-center justify-center gap-2">
                            Book Now <ArrowRight size={18} />
                        </Link>
                        <Link href="/contact" className="btn-secondary inline-flex items-center justify-center gap-2">
                            Get Directions
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
