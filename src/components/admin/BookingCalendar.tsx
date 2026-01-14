'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'

interface Booking {
    id: string
    room_id: string
    room_name: string
    check_in: string
    check_out: string
    guest_name: string
    status: string
}

interface BookingCalendarProps {
    bookings: Booking[]
    onDateClick?: (date: Date) => void
    onBookingClick?: (booking: Booking) => void
}

export default function BookingCalendar({
    bookings,
    onDateClick,
    onBookingClick
}: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Add padding days for the calendar grid
    const startDay = monthStart.getDay()
    const endDay = 6 - monthEnd.getDay()
    const paddingStart = Array(startDay).fill(null)
    const paddingEnd = Array(endDay).fill(null)
    const allDays = [...paddingStart, ...days, ...paddingEnd]

    const getBookingsForDate = (date: Date) => {
        return bookings.filter(booking => {
            const checkIn = new Date(booking.check_in)
            const checkOut = new Date(booking.check_out)
            return date >= checkIn && date < checkOut
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500'
            case 'pending': return 'bg-amber-500'
            case 'cancelled': return 'bg-red-500'
            default: return 'bg-slate-500'
        }
    }

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ChevronLeft size={20} className="text-slate-400" />
                </button>
                <h2 className="text-lg font-medium text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ChevronRight size={20} className="text-slate-400" />
                </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 border-b border-slate-800">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-slate-500 uppercase">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
                {allDays.map((day, index) => {
                    if (!day) {
                        return <div key={`empty-${index}`} className="min-h-24 border-b border-r border-slate-800/50 bg-slate-900/30" />
                    }

                    const dayBookings = getBookingsForDate(day)
                    const isCurrentMonth = isSameMonth(day, currentMonth)
                    const isCurrentDay = isToday(day)

                    return (
                        <div
                            key={day.toISOString()}
                            onClick={() => onDateClick?.(day)}
                            className={`min-h-24 p-2 border-b border-r border-slate-800/50 transition-colors cursor-pointer hover:bg-slate-800/30 ${!isCurrentMonth ? 'bg-slate-900/50' : ''
                                }`}
                        >
                            <div className={`text-sm mb-1 ${isCurrentDay
                                    ? 'w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white font-medium'
                                    : isCurrentMonth ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                {format(day, 'd')}
                            </div>

                            <div className="space-y-1">
                                {dayBookings.slice(0, 3).map(booking => (
                                    <div
                                        key={booking.id}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onBookingClick?.(booking)
                                        }}
                                        className={`text-xs p-1 rounded truncate text-white ${getStatusColor(booking.status)}`}
                                    >
                                        {booking.guest_name}
                                    </div>
                                ))}
                                {dayBookings.length > 3 && (
                                    <div className="text-xs text-slate-500">
                                        +{dayBookings.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
