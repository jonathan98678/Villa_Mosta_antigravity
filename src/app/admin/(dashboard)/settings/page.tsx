'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Setting {
    key: string
    value: string
    description: string | null
}

const settingGroups = [
    {
        title: 'Site Information',
        keys: ['site_name', 'site_description', 'contact_email', 'contact_phone']
    },
    {
        title: 'Business Settings',
        keys: ['default_currency', 'timezone', 'booking_lead_time', 'max_advance_booking_days']
    },
    {
        title: 'Social Media',
        keys: ['instagram_url', 'facebook_url', 'google_maps_url']
    }
]

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            const data = await res.json()
            if (data.success && data.settingsObject) {
                setSettings(data.settingsObject)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Save each setting individually
            for (const [key, value] of Object.entries(settings)) {
                await fetch('/api/admin/settings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, value })
                })
            }
            toast.success('Settings saved successfully!')
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const updateSetting = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
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
                    <h1 className="text-2xl font-semibold text-white">Site Settings</h1>
                    <p className="text-slate-400 mt-1">Configure your website settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <div className="space-y-8">
                {settingGroups.map((group) => (
                    <div key={group.title} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-medium text-white mb-6">{group.title}</h2>
                        <div className="space-y-4">
                            {group.keys.map((key) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
                                        {key.replace(/_/g, ' ')}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings[key] || ''}
                                        onChange={(e) => updateSetting(key, e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
