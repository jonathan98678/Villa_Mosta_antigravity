'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'

interface FieldConfig {
    key: string
    label: string
    type: 'text' | 'textarea' | 'array' | 'object'
    placeholder?: string
    fields?: FieldConfig[] // For nested objects
}

interface ContentEditorProps {
    content: Record<string, unknown>
    fields: FieldConfig[]
    onSave: (content: Record<string, unknown>) => Promise<void>
    title?: string
}

export default function ContentEditor({
    content,
    fields,
    onSave,
    title = 'Edit Content'
}: ContentEditorProps) {
    const [data, setData] = useState<Record<string, unknown>>(content)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setData(content)
    }, [content])

    const handleChange = (key: string, value: unknown) => {
        setData(prev => ({ ...prev, [key]: value }))
    }

    const handleArrayAdd = (key: string) => {
        const arr = (data[key] as unknown[]) || []
        handleChange(key, [...arr, ''])
    }

    const handleArrayRemove = (key: string, index: number) => {
        const arr = [...((data[key] as unknown[]) || [])]
        arr.splice(index, 1)
        handleChange(key, arr)
    }

    const handleArrayItemChange = (key: string, index: number, value: unknown) => {
        const arr = [...((data[key] as unknown[]) || [])]
        arr[index] = value
        handleChange(key, arr)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await onSave(data)
        } finally {
            setSaving(false)
        }
    }

    const renderField = (field: FieldConfig) => {
        const value = data[field.key]

        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={(value as string) || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                )

            case 'textarea':
                return (
                    <textarea
                        value={(value as string) || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                    />
                )

            case 'array':
                const arr = (value as string[]) || []
                return (
                    <div className="space-y-2">
                        {arr.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleArrayItemChange(field.key, index, e.target.value)}
                                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                />
                                <button
                                    onClick={() => handleArrayRemove(field.key, index)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => handleArrayAdd(field.key)}
                            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm"
                        >
                            <Plus size={16} />
                            Add Item
                        </button>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">{title}</h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save
                </button>
            </div>

            <div className="p-6 space-y-6">
                {fields.map((field) => (
                    <div key={field.key}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            {field.label}
                        </label>
                        {renderField(field)}
                    </div>
                ))}
            </div>
        </div>
    )
}
