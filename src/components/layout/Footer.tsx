import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Instagram, Facebook } from 'lucide-react'

async function getFooterContent() {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('site_content')
            .select('content')
            .eq('page', 'footer')
            .eq('section', 'main')
            .single()

        return data?.content as {
            aboutText?: string
            email?: string
            phone?: string
            address?: string
            city?: string
            country?: string
            socialLinks?: { instagram?: string; facebook?: string }
        } | null
    } catch {
        return null
    }
}

export async function Footer() {
    const content = await getFooterContent()

    return (
        <footer className="bg-neutral-950 border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block">
                            <h3 className="font-serif text-2xl text-white">Villa Mosta</h3>
                        </Link>
                        <p className="mt-4 text-neutral-400 max-w-md leading-relaxed">
                            {content?.aboutText || 'A charming 3-bedroom villa in the heart of Mosta, Malta. Experience authentic Maltese hospitality just steps from the famous Rotunda.'}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-6">
                            {content?.socialLinks?.instagram && (
                                <a
                                    href={content.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-neutral-900 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
                                >
                                    <Instagram size={20} />
                                </a>
                            )}
                            {content?.socialLinks?.facebook && (
                                <a
                                    href={content.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-neutral-900 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
                                >
                                    <Facebook size={20} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Explore
                        </h4>
                        <ul className="space-y-3">
                            {['The Villa', 'Rooms', 'Location', 'Reviews', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Contact
                        </h4>
                        <ul className="space-y-3 text-neutral-400">
                            {content?.email && (
                                <li>
                                    <a href={`mailto:${content.email}`} className="hover:text-white transition-colors">
                                        {content.email}
                                    </a>
                                </li>
                            )}
                            {content?.phone && (
                                <li>
                                    <a href={`tel:${content.phone}`} className="hover:text-white transition-colors">
                                        {content.phone}
                                    </a>
                                </li>
                            )}
                            {content?.address && (
                                <li>{content.address}</li>
                            )}
                            {content?.city && (
                                <li>{content.city}{content.country ? `, ${content.country}` : ''}</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-neutral-500 text-sm">
                        © {new Date().getFullYear()} Villa Mosta. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-neutral-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
