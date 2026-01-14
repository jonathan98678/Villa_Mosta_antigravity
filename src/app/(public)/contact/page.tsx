'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (data.success) {
                setSubmitted(true)
                toast.success('Message sent successfully!')
            } else {
                toast.error(data.error || 'Failed to send message')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="max-w-md mx-auto px-6 text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} className="text-emerald-500" />
                    </div>
                    <h1 className="font-serif text-3xl text-white mb-4">Message Sent!</h1>
                    <p className="text-neutral-400 mb-8">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false)
                            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                        }}
                        className="text-amber-500 hover:text-amber-400"
                    >
                        Send another message
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <section className="py-24 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-neutral-400">
                        Have a question or special request? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            {/* Form */}
            <section className="py-24 bg-neutral-900">
                <div className="max-w-2xl mx-auto px-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Message *
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}
