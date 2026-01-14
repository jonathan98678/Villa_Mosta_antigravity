'use client'

import { useState, useEffect } from 'react'
import { Loader2, Eye } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Booking } from '@/types/database'

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<{ total: number; confirmed: number; totalRevenue: number }>({ total: 0, confirmed: 0, totalRevenue: 0 })
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [filter, setFilter] = useState<string>('')

    useEffect(() => {
        fetchBookings()
    }, [filter])

    const fetchBookings = async () => {
        try {
            const url = filter ? `/api/admin/bookings?status=${filter}` : '/api/admin/bookings'
            const res = await fetch(url)
            const data = await res.json()
            if (data.success) {
                setBookings(data.data)
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateBookingStatus = async (id: string, field: string, value: string) => {
        try {
            await fetch(`/api/admin/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            })
            fetchBookings()
            setSelectedBooking(null)
        } catch (error) {
            console.error('Error updating booking:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Bookings</h1>
                    <p className="text-slate-400 mt-1">
                        {stats.total} bookings · {formatPrice(stats.totalRevenue)} revenue
                    </p>
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="">All Bookings</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Guest</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Room</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Guests</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{booking.guest_name}</p>
                                                <p className="text-slate-500 text-sm">{booking.guest_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-300">{booking.room?.name || 'Unknown'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-300 text-sm">
                                                {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-300">{booking.num_guests}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-medium">{formatPrice(booking.total_price)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${booking.booking_status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                          ${booking.booking_status === 'completed' ? 'bg-blue-500/10 text-blue-400' : ''}
                          ${booking.booking_status === 'cancelled' ? 'bg-red-500/10 text-red-400' : ''}
                        `}>
                                                    {booking.booking_status}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs
                          ${booking.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                          ${booking.payment_status === 'pending' ? 'bg-amber-500/10 text-amber-400' : ''}
                          ${booking.payment_status === 'failed' ? 'bg-red-500/10 text-red-400' : ''}
                        `}>
                                                    {booking.payment_status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        No bookings found.
                    </div>
                )}
            </div>

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-xl max-w-lg w-full">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-semibold text-white">Booking Details</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-400">Guest</p>
                                    <p className="text-white">{selectedBooking.guest_name}</p>
                                    <p className="text-slate-400 text-sm">{selectedBooking.guest_email}</p>
                                    {selectedBooking.guest_phone && (
                                        <p className="text-slate-400 text-sm">{selectedBooking.guest_phone}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Room</p>
                                    <p className="text-white">{selectedBooking.room?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Check-in</p>
                                    <p className="text-white">{formatDate(selectedBooking.check_in, 'long')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Check-out</p>
                                    <p className="text-white">{formatDate(selectedBooking.check_out, 'long')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Guests</p>
                                    <p className="text-white">{selectedBooking.num_guests}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Total</p>
                                    <p className="text-white text-lg font-semibold">{formatPrice(selectedBooking.total_price)}</p>
                                </div>
                            </div>

                            {selectedBooking.special_requests && (
                                <div>
                                    <p className="text-sm text-slate-400">Special Requests</p>
                                    <p className="text-white mt-1">{selectedBooking.special_requests}</p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-sm text-slate-400 mb-2">Update Status</p>
                                <div className="flex gap-2">
                                    <select
                                        defaultValue={selectedBooking.booking_status}
                                        onChange={(e) => updateBookingStatus(selectedBooking.id, 'booking_status', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                                    >
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <select
                                        defaultValue={selectedBooking.payment_status}
                                        onChange={(e) => updateBookingStatus(selectedBooking.id, 'payment_status', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-800">
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="w-full px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
