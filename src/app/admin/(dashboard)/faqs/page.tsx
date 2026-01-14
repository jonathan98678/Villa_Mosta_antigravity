'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, GripVertical } from 'lucide-react'

interface FAQ {
    id: string
    question: string
    answer: string
    category: string | null
    order_index: number
    is_active: boolean
}

export default function AdminFAQsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: ''
    })

    useEffect(() => {
        fetchFAQs()
    }, [])

    const fetchFAQs = async () => {
        try {
            const res = await fetch('/api/admin/faqs')
            const data = await res.json()
            if (data.success) {
                setFaqs(data.data)
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingFaq ? `/api/admin/faqs/${editingFaq.id}` : '/api/admin/faqs'
            const res = await fetch(url, {
                method: editingFaq ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if (data.success) {
                fetchFAQs()
                resetForm()
            }
        } catch (error) {
            console.error('Error saving FAQ:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (faq: FAQ) => {
        setEditingFaq(faq)
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category || ''
        })
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this FAQ?')) return
        try {
            await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
            fetchFAQs()
        } catch (error) {
            console.error('Error deleting FAQ:', error)
        }
    }

    const toggleActive = async (faq: FAQ) => {
        try {
            await fetch(`/api/admin/faqs/${faq.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !faq.is_active })
            })
            fetchFAQs()
        } catch (error) {
            console.error('Error toggling FAQ:', error)
        }
    }

    const resetForm = () => {
        setShowForm(false)
        setEditingFaq(null)
        setFormData({ question: '', answer: '', category: '' })
    }

    // Group by category
    const grouped = faqs.reduce((acc, faq) => {
        const cat = faq.category || 'General'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(faq)
        return acc
    }, {} as Record<string, FAQ[]>)

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
                    <h1 className="text-2xl font-semibold text-white">FAQs</h1>
                    <p className="text-slate-400 mt-1">{faqs.length} questions</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Add FAQ
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-semibold text-white">
                                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g., Booking, Amenities, Policies"
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Question</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Answer</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {saving && <Loader2 size={16} className="animate-spin" />}
                                    {editingFaq ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FAQs List */}
            <div className="space-y-8">
                {Object.entries(grouped).map(([category, categoryFaqs]) => (
                    <div key={category}>
                        <h2 className="text-lg font-medium text-amber-500 mb-4">{category}</h2>
                        <div className="space-y-3">
                            {categoryFaqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className={`bg-slate-900/50 border rounded-xl p-5 ${faq.is_active ? 'border-slate-800' : 'border-slate-800/50 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <GripVertical size={18} className="text-slate-600 mt-1 cursor-move" />
                                            <div>
                                                <h3 className="text-white font-medium">{faq.question}</h3>
                                                <p className="text-slate-400 mt-2 text-sm line-clamp-2">{faq.answer}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleActive(faq)}
                                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${faq.is_active
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : 'bg-slate-800 text-slate-500'
                                                    }`}
                                            >
                                                {faq.is_active ? 'Active' : 'Hidden'}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(faq)}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id)}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No FAQs yet. Add your first question to help guests.
                    </div>
                )}
            </div>
        </div>
    )
}
