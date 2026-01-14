'use client'

import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2, Loader2, CheckCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Contact {
    id: string
    name: string
    email: string
    phone: string | null
    subject: string
    message: string
    is_read: boolean
    is_responded: boolean
    created_at: string
}

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/admin/contacts')
            const data = await res.json()
            if (data.success) {
                setContacts(data.data)
                setUnreadCount(data.unreadCount)
            }
        } catch (error) {
            console.error('Error fetching contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (contact: Contact) => {
        if (contact.is_read) return
        try {
            await fetch(`/api/admin/contacts/${contact.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_read: true })
            })
            fetchContacts()
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const markAsResponded = async (id: string) => {
        try {
            await fetch(`/api/admin/contacts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_responded: true })
            })
            fetchContacts()
            setSelectedContact(null)
        } catch (error) {
            console.error('Error marking as responded:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message?')) return
        try {
            await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
            fetchContacts()
            setSelectedContact(null)
        } catch (error) {
            console.error('Error deleting contact:', error)
        }
    }

    const openContact = (contact: Contact) => {
        setSelectedContact(contact)
        markAsRead(contact)
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
                    <h1 className="text-2xl font-semibold text-white">Messages</h1>
                    <p className="text-slate-400 mt-1">
                        {contacts.length} messages · {unreadCount} unread
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Messages List */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => openContact(contact)}
                                className={`p-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${selectedContact?.id === contact.id ? 'bg-slate-800/50' : ''
                                    } ${!contact.is_read ? 'bg-amber-500/5' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 ${contact.is_read ? 'text-slate-600' : 'text-amber-500'}`}>
                                        {contact.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`font-medium truncate ${contact.is_read ? 'text-slate-300' : 'text-white'}`}>
                                                {contact.name}
                                            </p>
                                            <p className="text-xs text-slate-500 flex-shrink-0">
                                                {formatDate(contact.created_at)}
                                            </p>
                                        </div>
                                        <p className="text-slate-400 text-sm truncate">{contact.subject}</p>
                                        <p className="text-slate-500 text-xs truncate mt-1">{contact.message}</p>
                                    </div>
                                    {contact.is_responded && (
                                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        ))}

                        {contacts.length === 0 && (
                            <div className="p-12 text-center text-slate-500">
                                No messages yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    {selectedContact ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-slate-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-medium text-white">{selectedContact.subject}</h2>
                                        <p className="text-slate-400 text-sm mt-1">
                                            From {selectedContact.name} · {formatDate(selectedContact.created_at, 'long')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedContact.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 flex-1">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                                        <a href={`mailto:${selectedContact.email}`} className="text-amber-500 hover:text-amber-400">
                                            {selectedContact.email}
                                        </a>
                                    </div>
                                    {selectedContact.phone && (
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
                                            <a href={`tel:${selectedContact.phone}`} className="text-white">
                                                {selectedContact.phone}
                                            </a>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Message</p>
                                        <p className="text-slate-300 whitespace-pre-wrap">{selectedContact.message}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800">
                                {selectedContact.is_responded ? (
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <CheckCircle size={18} />
                                        <span>Marked as responded</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => markAsResponded(selectedContact.id)}
                                        className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                                    >
                                        Mark as Responded
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full p-12 text-slate-500">
                            Select a message to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
