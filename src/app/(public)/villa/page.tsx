import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Star, Bed, Bath, Maximize, Users, Sparkles, ArrowRight } from 'lucide-react'

async function getVillaContent() {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('site_content')
            .select('*')
            .eq('section', 'villa')
            .single()
        return data?.content || null
    } catch {
        return null
    }
}

const defaultContent = {
    title: 'Villa Mosta',
    subtitle: 'About Our Property',
    description: 'A charming Maltese homestay offering authentic hospitality, city views, and the perfect base for exploring Malta.',
    story: {
        title: 'Our Story',
        text: 'Villa Mosta offers an authentic Maltese homestay experience in the heart of historic Mosta. Our property combines modern comforts with traditional charm, featuring private balconies with city views, a beautiful sun terrace, and warm hospitality that has earned us a 9.5 rating on Booking.com. Located just steps from the famous Mosta Rotunda, we provide the perfect base for exploring Malta\'s rich history and stunning landscapes.'
    },
    features: [
        { icon: 'Bed', value: '3', label: 'Comfortable Rooms' },
        { icon: 'Bath', value: '3', label: 'Private Bathrooms' },
        { icon: 'Maximize', value: '344', label: 'Sq Ft (Largest Room)' },
        { icon: 'Users', value: '6', label: 'Max Guests' }
    ],
    highlights: [
        { title: 'Sun Terrace', description: 'Relax and enjoy the Maltese sunshine on our rooftop terrace' },
        { title: 'City Views', description: 'Stunning views of Mosta from private balconies' },
        { title: 'Air Conditioning', description: 'Stay cool with climate control in every room' },
        { title: 'Free WiFi', description: 'High-speed internet throughout the property' },
        { title: 'Tea & Coffee', description: 'Complimentary tea and coffee maker in each room' },
        { title: 'Outdoor Dining', description: 'Patio area perfect for al fresco meals' }
    ]
}

export default async function VillaPage() {
    const cmsContent = await getVillaContent()
    const content = cmsContent || defaultContent

    return (
        <div className="min-h-screen pt-20">
            {/* Hero */}
            <section className="relative py-32 bg-neutral-950 overflow-hidden">
                <div className="absolute inset-0 bg-radial-top opacity-40" />
                <div className="absolute inset-0 decorative-grid opacity-20" />

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block animate-slide-down">
                        {content.subtitle || 'About Us'}
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 animate-slide-up delay-100">
                        {content.title || 'Villa Mosta'}
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto animate-slide-up delay-200">
                        {content.description}
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-neutral-900/50 border-y border-neutral-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {(content.features || defaultContent.features).map((feature: { icon: string; value: string; label: string }, i: number) => {
                            const IconComponent = { Bed, Bath, Maximize, Users }[feature.icon] || Star
                            return (
                                <div key={i} className="text-center">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className="text-amber-500" size={24} />
                                    </div>
                                    <div className="text-3xl font-serif text-white mb-1">{feature.value}</div>
                                    <div className="text-neutral-400 text-sm">{feature.label}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="section-lg bg-neutral-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-center opacity-30" />
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-800 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-neutral-900" />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block">
                                {content.story?.title || 'Our Story'}
                            </span>
                            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
                                A Legacy of Excellence
                            </h2>
                            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                                {content.story?.text || defaultContent.story.text}
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="accent-line" />
                                <Link href="/rooms" className="text-amber-500 hover:text-amber-400 inline-flex items-center gap-2 transition-colors">
                                    Explore Our Rooms <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="section-lg bg-neutral-900">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4 block">Features</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Villa Highlights</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">Discover the amenities that make Villa Mosta truly special</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(content.highlights || defaultContent.highlights).map((highlight: { title: string; description: string }, i: number) => (
                            <div
                                key={i}
                                className="p-6 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-amber-500/30 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                                        <Sparkles className="text-amber-500" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">{highlight.title}</h3>
                                        <p className="text-neutral-400 text-sm">{highlight.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-lg bg-neutral-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-orange-900/10" />

                <div className="max-w-4xl mx-auto px-6 text-center relative">
                    <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
                        Experience Villa Mosta
                    </h2>
                    <p className="text-xl text-neutral-400 mb-10">
                        Ready to explore Malta from our perfect location? Book your stay today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/book" className="btn-primary inline-flex items-center justify-center gap-2">
                            Book Your Stay <ArrowRight size={18} />
                        </Link>
                        <Link href="/contact" className="btn-secondary inline-flex items-center justify-center gap-2">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
