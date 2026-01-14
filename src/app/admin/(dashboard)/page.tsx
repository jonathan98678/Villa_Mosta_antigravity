import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/StatsCard'
import { CalendarDays, Euro, BedDouble, Star, Mail } from 'lucide-react'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'

async function getDashboardStats() {
    const supabase = await createClient()

    // Get bookings stats
    const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

    const confirmedBookings = bookings?.filter(b => b.booking_status === 'confirmed') || []
    const paidBookings = bookings?.filter(b => b.payment_status === 'paid') || []
    const totalRevenue = paidBookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0)

    // Get rooms count
    const { count: roomsCount } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

    // Get reviews stats
    const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('is_active', true)

    const avgRating = reviews?.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0'

    // Get unread contacts
    const { count: unreadContacts } = await supabase
        .from('contact_requests')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

    // Recent bookings
    const recentBookings = bookings?.slice(0, 5) || []

    return {
        totalBookings: bookings?.length || 0,
        confirmedBookings: confirmedBookings.length,
        totalRevenue,
        roomsCount: roomsCount || 0,
        avgRating,
        reviewsCount: reviews?.length || 0,
        unreadContacts: unreadContacts || 0,
        recentBookings
    }
}

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(stats.totalRevenue)}
                    description="From paid bookings"
                    icon={<Euro size={24} />}
                />
                <StatsCard
                    title="Active Bookings"
                    value={stats.confirmedBookings}
                    description={`${stats.totalBookings} total bookings`}
                    icon={<CalendarDays size={24} />}
                />
                <StatsCard
                    title="Active Rooms"
                    value={stats.roomsCount}
                    description="Available for booking"
                    icon={<BedDouble size={24} />}
                />
                <StatsCard
                    title="Average Rating"
                    value={stats.avgRating}
                    description={`From ${stats.reviewsCount} reviews`}
                    icon={<Star size={24} />}
                />
            </div>

            {/* Alerts */}
            {stats.unreadContacts > 0 && (
                <Link
                    href="/admin/contacts"
                    className="block bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 hover:bg-amber-500/20 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Mail className="text-amber-500" size={20} />
                        <p className="text-amber-500">
                            You have <strong>{stats.unreadContacts}</strong> unread message{stats.unreadContacts > 1 ? 's' : ''}
                        </p>
                    </div>
                </Link>
            )}

            {/* Recent Bookings */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
                    <Link
                        href="/admin/bookings"
                        className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
                    >
                        View all →
                    </Link>
                </div>

                {stats.recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Guest</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {stats.recentBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{booking.guest_name}</p>
                                                <p className="text-slate-500 text-sm">{booking.guest_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-300 text-sm">
                                                {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white">{formatPrice(parseFloat(booking.total_price))}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${booking.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                        ${booking.payment_status === 'pending' ? 'bg-amber-500/10 text-amber-400' : ''}
                        ${booking.payment_status === 'failed' ? 'bg-red-500/10 text-red-400' : ''}
                      `}>
                                                {booking.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        No bookings yet. They will appear here once guests start booking.
                    </div>
                )}
            </div>
        </div>
    )
}
