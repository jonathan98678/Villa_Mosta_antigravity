'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/villa', label: 'The Villa' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/location', label: 'Location' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/contact', label: 'Contact' },
]

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-800/50'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="relative z-10">
                            <h1 className="font-serif text-2xl text-white tracking-wide">
                                Villa Mosta
                            </h1>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-neutral-300 hover:text-white transition-colors link-underline"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Book CTA */}
                        <div className="hidden lg:block">
                            <Link
                                href="/book"
                                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-full hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
                            >
                                Book Now
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-white"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <nav className="absolute top-20 left-0 right-0 bg-neutral-950 border-b border-neutral-800 p-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-lg text-neutral-200 hover:text-white py-2"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/book"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-full mt-4"
                        >
                            Book Now
                        </Link>
                    </nav>
                </div>
            )}
        </>
    )
}
