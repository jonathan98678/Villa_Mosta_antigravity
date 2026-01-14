'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-radial-top opacity-30" />
            <div className="absolute inset-0 decorative-grid opacity-20" />

            {/* Decorative elements */}
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-float delay-200" />

            <div className="relative text-center px-6">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <span className="text-[12rem] md:text-[16rem] font-serif font-bold text-neutral-900 select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl md:text-7xl font-serif gradient-text">
                            Page Not Found
                        </span>
                    </div>
                </div>

                <p className="text-xl text-neutral-400 mb-12 max-w-md mx-auto">
                    The page you&apos;re looking for seems to have wandered off. Let&apos;s get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary inline-flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}
