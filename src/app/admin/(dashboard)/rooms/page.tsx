'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Room } from '@/types/database'

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingRoom, setEditingRoom] = useState<Room | null>(null)
    const [saving, setSaving] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        base_price: '',
        max_guests: '2',
        min_nights: '1',
        features: '',
        images: ''
    })

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        try {
            const res = await fetch('/api/admin/rooms')
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                base_price: formData.base_price,
                max_guests: parseInt(formData.max_guests),
                min_nights: parseInt(formData.min_nights),
                features: formData.features.split('\n').filter(f => f.trim()),
                images: formData.images.split('\n').filter(i => i.trim())
            }

            const url = editingRoom
                ? `/api/admin/rooms/${editingRoom.id}`
                : '/api/admin/rooms'

            const res = await fetch(url, {
                method: editingRoom ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (data.success) {
                fetchRooms()
                resetForm()
            }
        } catch (error) {
            console.error('Error saving room:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (room: Room) => {
        setEditingRoom(room)
        setFormData({
            name: room.name,
            description: room.description,
            base_price: String(room.base_price),
            max_guests: String(room.max_guests),
            min_nights: String(room.min_nights),
            features: room.features.join('\n'),
            images: room.images.join('\n')
        })
        setShowForm(true)
    }

    const handleToggleActive = async (room: Room) => {
        try {
            await fetch(`/api/admin/rooms/${room.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !room.is_active })
            })
            fetchRooms()
        } catch (error) {
            console.error('Error toggling room:', error)
        }
    }

    const handleDelete = async (room: Room) => {
        if (!confirm('Are you sure you want to delete this room?')) return

        try {
            await fetch(`/api/admin/rooms/${room.id}`, { method: 'DELETE' })
            fetchRooms()
        } catch (error) {
            console.error('Error deleting room:', error)
        }
    }

    const resetForm = () => {
        setShowForm(false)
        setEditingRoom(null)
        setFormData({
            name: '',
            description: '',
            base_price: '',
            max_guests: '2',
            min_nights: '1',
            features: '',
            images: ''
        })
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
                    <h1 className="text-2xl font-semibold text-white">Rooms</h1>
                    <p className="text-slate-400 mt-1">Manage your accommodations</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Add Room
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-semibold text-white">
                                {editingRoom ? 'Edit Room' : 'Add New Room'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Price/Night (€)</label>
                                    <input
                                        type="number"
                                        value={formData.base_price}
                                        onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Max Guests</label>
                                    <input
                                        type="number"
                                        value={formData.max_guests}
                                        onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Min Nights</label>
                                    <input
                                        type="number"
                                        value={formData.min_nights}
                                        onChange={(e) => setFormData({ ...formData, min_nights: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Features (one per line)
                                </label>
                                <textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    rows={4}
                                    placeholder="Private Terrace&#10;Ocean View&#10;King Bed"
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Image URLs (one per line)
                                </label>
                                <textarea
                                    value={formData.images}
                                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                    rows={3}
                                    placeholder="/images/rooms/room1.jpg"
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving && <Loader2 size={16} className="animate-spin" />}
                                    {editingRoom ? 'Update Room' : 'Create Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rooms Grid */}
            <div className="grid gap-4">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={`bg-slate-900/50 border rounded-xl p-6 ${room.is_active ? 'border-slate-800' : 'border-slate-800/50 opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-white">{room.name}</h3>
                                    {!room.is_active && (
                                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 mt-1 line-clamp-2">{room.description}</p>
                                <div className="flex items-center gap-4 mt-3 text-sm">
                                    <span className="text-amber-500 font-medium">{formatPrice(room.base_price)}/night</span>
                                    <span className="text-slate-500">Up to {room.max_guests} guests</span>
                                    <span className="text-slate-500">Min {room.min_nights} nights</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {room.features.slice(0, 5).map((feature, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                                            {feature}
                                        </span>
                                    ))}
                                    {room.features.length > 5 && (
                                        <span className="px-2 py-1 bg-slate-800 text-slate-500 rounded text-xs">
                                            +{room.features.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggleActive(room)}
                                    className={`p-2 rounded-lg transition-colors ${room.is_active
                                            ? 'text-emerald-400 hover:bg-emerald-500/10'
                                            : 'text-slate-500 hover:bg-slate-800'
                                        }`}
                                    title={room.is_active ? 'Deactivate' : 'Activate'}
                                >
                                    {room.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button
                                    onClick={() => handleEdit(room)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(room)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {rooms.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No rooms yet. Click &quot;Add Room&quot; to create your first accommodation.
                    </div>
                )}
            </div>
        </div>
    )
}
