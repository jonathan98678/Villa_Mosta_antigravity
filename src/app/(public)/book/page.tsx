'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar, Users, Loader2, ArrowRight, Check } from 'lucide-react'
import { formatPrice, calculateNights } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Room {
    id: string
    name: string
    base_price: number
    max_guests: number
    min_nights: number
    images: string[]
}

interface AvailabilityData {
    isAvailable: boolean
    pricePerNight: number
    totalNights: number
    totalPrice: number
    bookingFee: number
    minNights: number
    reason?: string
}

function BookingContent() {
    const searchParams = useSearchParams()
    const preselectedRoom = searchParams.get('room')

    const [step, setStep] = useState(1)
    const [rooms, setRooms] = useState<Room[]>([])
    const [loading, setLoading] = useState(true)
    const [checkingAvailability, setCheckingAvailability] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [availability, setAvailability] = useState<AvailabilityData | null>(null)

    const [formData, setFormData] = useState({
        roomId: preselectedRoom || '',
        checkIn: '',
        checkOut: '',
        guests: '2',
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
    })

    useEffect(() => {
        fetchRooms()
    }, [])

    useEffect(() => {
        if (preselectedRoom && rooms.length > 0) {
            setFormData(prev => ({ ...prev, roomId: preselectedRoom }))
        }
    }, [preselectedRoom, rooms])

    const fetchRooms = async () => {
        try {
            const res = await fetch('/api/rooms')
            const data = await res.json()
            if (data.success) {
                setRooms(data.data)
            }
        } catch (error) {
            console.error('Error fetching rooms:', error)
        } finally {
            setLoading(false)
        }
    }

    const checkAvailability = async () => {
        if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
            toast.error('Please select room and dates')
            return
        }

        setCheckingAvailability(true)
        try {
            const res = await fetch(
                `/api/bookings/availability?roomId=${formData.roomId}&startDate=${formData.checkIn}&endDate=${formData.checkOut}`
            )
            const data = await res.json()

            if (data.success) {
                setAvailability(data.data)
                if (data.data.isAvailable) {
                    setStep(2)
                } else {
                    toast.error(data.data.reason || 'Room not available for selected dates')
                }
            }
        } catch {
            toast.error('Error checking availability')
        } finally {
            setCheckingAvailability(false)
        }
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.email) {
            toast.error('Please fill in all required fields')
            return
        }

        const selectedRoom = rooms.find(r => r.id === formData.roomId)
        if (selectedRoom && parseInt(formData.guests) > selectedRoom.max_guests) {
            toast.error(`Maximum ${selectedRoom.max_guests} guests for this room`)
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch('/api/bookings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: formData.roomId,
                    checkIn: formData.checkIn,
                    checkOut: formData.checkOut,
                    guestName: formData.name,
                    guestEmail: formData.email,
                    guestPhone: formData.phone,
                    numGuests: parseInt(formData.guests),
                    specialRequests: formData.specialRequests
                })
            })

            const data = await res.json()

            if (data.success) {
                setStep(3)
                toast.success('Booking created! In production, you would be redirected to Stripe.')
            } else {
                toast.error(data.error || 'Failed to create booking')
            }
        } catch {
            toast.error('An error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    const selectedRoom = rooms.find(r => r.id === formData.roomId)
    const nights = formData.checkIn && formData.checkOut
        ? calculateNights(formData.checkIn, formData.checkOut)
        : 0

    const today = new Date().toISOString().split('T')[0]

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-amber-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <section className="py-16 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-serif text-5xl text-white mb-4">Book Your Stay</h1>
                    <p className="text-neutral-400">Reserve your perfect getaway at Villa Mosta</p>
                </div>
            </section>

            {/* Progress Steps */}
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="flex items-center justify-center gap-4">
                    {[
                        { num: 1, label: 'Select Dates' },
                        { num: 2, label: 'Guest Details' },
                        { num: 3, label: 'Confirmation' }
                    ].map((s, i) => (
                        <div key={s.num} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= s.num
                                ? 'bg-amber-500 text-white'
                                : 'bg-neutral-800 text-neutral-500'
                                }`}>
                                {step > s.num ? <Check size={18} /> : s.num}
                            </div>
                            <span className={`ml-2 hidden sm:block ${step >= s.num ? 'text-white' : 'text-neutral-500'}`}>
                                {s.label}
                            </span>
                            {i < 2 && <div className="w-12 h-px bg-neutral-800 mx-4" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <section className="pb-24">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Step 1: Room & Dates */}
                    {step === 1 && (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                            <h2 className="text-xl font-medium text-white mb-6">Select Room & Dates</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">Room</label>
                                    <select
                                        value={formData.roomId}
                                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    >
                                        <option value="">Select a room</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.name} - {formatPrice(room.base_price)}/night
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            <Calendar className="inline w-4 h-4 mr-1" /> Check-in
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.checkIn}
                                            min={today}
                                            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            <Calendar className="inline w-4 h-4 mr-1" /> Check-out
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.checkOut}
                                            min={formData.checkIn || today}
                                            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        <Users className="inline w-4 h-4 mr-1" /> Guests
                                    </label>
                                    <select
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(n => (
                                            <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Preview */}
                                {selectedRoom && nights > 0 && (
                                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
                                        <div className="flex justify-between text-neutral-400 mb-2">
                                            <span>{formatPrice(selectedRoom.base_price)} × {nights} nights</span>
                                            <span>{formatPrice(selectedRoom.base_price * nights)}</span>
                                        </div>
                                        <div className="flex justify-between text-white font-medium pt-2 border-t border-neutral-800">
                                            <span>Estimated Total</span>
                                            <span className="text-amber-500">{formatPrice(selectedRoom.base_price * nights)}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={checkAvailability}
                                    disabled={checkingAvailability || !formData.roomId || !formData.checkIn || !formData.checkOut}
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {checkingAvailability ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Checking...
                                        </>
                                    ) : (
                                        <>
                                            Check Availability
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Guest Details */}
                    {step === 2 && (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                            <h2 className="text-xl font-medium text-white mb-6">Guest Details</h2>

                            {/* Booking Summary */}
                            {availability && selectedRoom && (
                                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-6">
                                    <p className="text-amber-500 font-medium">{selectedRoom.name}</p>
                                    <p className="text-neutral-300 text-sm mt-1">
                                        {formData.checkIn} to {formData.checkOut} ({availability.totalNights} nights)
                                    </p>
                                    <p className="text-amber-500 text-xl font-medium mt-2">
                                        Total: {formatPrice(availability.totalPrice)}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">Phone (optional)</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">Special Requests</label>
                                    <textarea
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        rows={3}
                                        placeholder="Any special requests or notes for your stay..."
                                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 px-6 py-4 border border-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !formData.name || !formData.email}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Proceed to Payment
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={32} className="text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-serif text-white mb-4">Booking Confirmed!</h2>
                            <p className="text-neutral-400 mb-6">
                                Thank you for your reservation. A confirmation email has been sent to {formData.email}.
                            </p>
                            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg text-left mb-6">
                                <p className="text-white font-medium">{selectedRoom?.name}</p>
                                <p className="text-neutral-400 text-sm mt-1">
                                    {formData.checkIn} to {formData.checkOut}
                                </p>
                                <p className="text-neutral-400 text-sm">{formData.guests} guest{parseInt(formData.guests) > 1 ? 's' : ''}</p>
                            </div>
                            <p className="text-neutral-500 text-sm">
                                Note: In production, payment would be processed via Stripe before this confirmation.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default function BookingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-amber-500" />
            </div>
        }>
            <BookingContent />
        </Suspense>
    )
}
