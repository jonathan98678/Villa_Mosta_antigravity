'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    BedDouble,
    CalendarDays,
    Star,
    FileText,
    HelpCircle,
    Settings,
    Mail,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/rooms', label: 'Rooms', icon: BedDouble },
    { href: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    { href: '/admin/contacts', label: 'Messages', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await fetch('/api/admin/auth/logout', { method: 'POST' })
        router.push('/admin/login')
        router.refresh()
    }

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin'
        return pathname.startsWith(href)
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <Link href="/admin" className="block">
                        <h1 className="text-xl font-serif text-white">Villa Mosta</h1>
                        <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 flex-1 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${active
                                                ? 'bg-amber-500/10 text-amber-500'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }
                    `}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <Link
                        href="/"
                        className="block text-center text-sm text-slate-500 hover:text-white mb-3 transition-colors"
                    >
                        View Website →
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
