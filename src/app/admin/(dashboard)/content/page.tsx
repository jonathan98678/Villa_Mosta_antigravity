'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'

interface ContentSection {
    id: string
    page: string
    section: string
    content: Record<string, unknown>
}

const pages = ['home', 'villa', 'location', 'footer']

export default function AdminContentPage() {
    const [selectedPage, setSelectedPage] = useState('home')
    const [content, setContent] = useState<ContentSection[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editedContent, setEditedContent] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchContent()
    }, [selectedPage])

    const fetchContent = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/content?page=${selectedPage}`)
            const data = await res.json()
            if (data.success) {
                setContent(data.data)
                // Initialize edited content with stringified JSON
                const initial: Record<string, string> = {}
                data.data.forEach((c: ContentSection) => {
                    initial[c.section] = JSON.stringify(c.content, null, 2)
                })
                setEditedContent(initial)
            }
        } catch (error) {
            console.error('Error fetching content:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (section: string) => {
        setSaving(true)
        try {
            const contentJson = JSON.parse(editedContent[section])

            const res = await fetch('/api/admin/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: selectedPage,
                    section,
                    content: contentJson
                })
            })

            const data = await res.json()
            if (data.success) {
                fetchContent()
            }
        } catch (error) {
            console.error('Error saving content:', error)
            alert('Invalid JSON format')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">Content Management</h1>
                <p className="text-slate-400 mt-1">Edit your website content (JSON format)</p>
            </div>

            {/* Page Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-4">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setSelectedPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${selectedPage === page
                                ? 'bg-amber-500 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-amber-500" size={32} />
                </div>
            ) : (
                <div className="space-y-6">
                    {content.map((section) => (
                        <div key={section.id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white capitalize">{section.section}</h3>
                                <button
                                    onClick={() => handleSave(section.section)}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save
                                </button>
                            </div>
                            <div className="p-4">
                                <textarea
                                    value={editedContent[section.section] || ''}
                                    onChange={(e) => setEditedContent({ ...editedContent, [section.section]: e.target.value })}
                                    rows={12}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    ))}

                    {content.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No content sections found for this page. Run the database seed to add initial content.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
