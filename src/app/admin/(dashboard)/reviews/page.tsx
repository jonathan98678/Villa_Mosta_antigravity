'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Star, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Review } from '@/types/database'

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingReview, setEditingReview] = useState<Review | null>(null)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        guest_name: '',
        country: '',
        source: 'Our Website' as Review['source'],
        rating: '5',
        review_text: '',
        review_date: new Date().toISOString().split('T')[0],
        stay_type: '',
        room_type: '',
        is_featured: false
    })

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/admin/reviews')
            const data = await res.json()
            if (data.success) {
                setReviews(data.data)
            }
        } catch (error) {
            console.error('Error fetching reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingReview ? `/api/admin/reviews/${editingReview.id}` : '/api/admin/reviews'
            const res = await fetch(url, {
                method: editingReview ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if (data.success) {
                fetchReviews()
                resetForm()
            }
        } catch (error) {
            console.error('Error saving review:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (review: Review) => {
        setEditingReview(review)
        setFormData({
            guest_name: review.guest_name,
            country: review.country || '',
            source: review.source,
            rating: String(review.rating),
            review_text: review.review_text,
            review_date: review.review_date,
            stay_type: review.stay_type || '',
            room_type: review.room_type || '',
            is_featured: review.is_featured
        })
        setShowForm(true)
    }

    const toggleFeatured = async (review: Review) => {
        try {
            await fetch(`/api/admin/reviews/${review.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_featured: !review.is_featured })
            })
            fetchReviews()
        } catch (error) {
            console.error('Error updating review:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this review?')) return
        try {
            await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
            fetchReviews()
        } catch (error) {
            console.error('Error deleting review:', error)
        }
    }

    const resetForm = () => {
        setShowForm(false)
        setEditingReview(null)
        setFormData({
            guest_name: '',
            country: '',
            source: 'Our Website',
            rating: '5',
            review_text: '',
            review_date: new Date().toISOString().split('T')[0],
            stay_type: '',
            room_type: '',
            is_featured: false
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
        )
    }

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Reviews</h1>
                    <p className="text-slate-400 mt-1">{reviews.length} reviews · {avgRating} avg rating</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Add Review
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-semibold text-white">
                                {editingReview ? 'Edit Review' : 'Add New Review'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Guest Name</label>
                                    <input
                                        type="text"
                                        value={formData.guest_name}
                                        onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                                    <input
                                        type="text"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Source</label>
                                    <select
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value as Review['source'] })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    >
                                        <option value="Our Website">Our Website</option>
                                        <option value="Booking.com">Booking.com</option>
                                        <option value="Airbnb">Airbnb</option>
                                        <option value="Google Maps">Google Maps</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    >
                                        {[5, 4, 3, 2, 1].map(n => (
                                            <option key={n} value={n}>{n} Stars</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={formData.review_date}
                                        onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Review Text</label>
                                <textarea
                                    value={formData.review_text}
                                    onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Stay Type</label>
                                    <input
                                        type="text"
                                        value={formData.stay_type}
                                        onChange={(e) => setFormData({ ...formData, stay_type: e.target.value })}
                                        placeholder="e.g., Couple, Family"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Room Type</label>
                                    <input
                                        type="text"
                                        value={formData.room_type}
                                        onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                                        placeholder="e.g., Terrace Suite"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 rounded bg-slate-800 border-slate-700"
                                />
                                <span className="text-slate-300 text-sm">Featured review</span>
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {saving && <Loader2 size={16} className="animate-spin" />}
                                    {editingReview ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className={`bg-slate-900/50 border rounded-xl p-6 ${review.is_featured ? 'border-amber-500/50' : 'border-slate-800'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-white font-medium">{review.guest_name}</span>
                                    {review.country && <span className="text-slate-500">· {review.country}</span>}
                                    <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">{review.source}</span>
                                    {review.is_featured && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">Featured</span>}
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                                    ))}
                                    <span className="text-slate-500 text-sm ml-2">{formatDate(review.review_date)}</span>
                                </div>
                                <p className="text-slate-300 line-clamp-3">{review.review_text}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => toggleFeatured(review)} className={`p-2 rounded-lg transition-colors ${review.is_featured ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:bg-slate-800'}`}>
                                    <Star size={18} />
                                </button>
                                <button onClick={() => handleEdit(review)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(review.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No reviews yet. Add your first review to showcase guest experiences.
                    </div>
                )}
            </div>
        </div>
    )
}
