'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
    images: string[]
    onChange: (images: string[]) => void
    maxImages?: number
    folder?: string
}

export default function ImageUploader({
    images,
    onChange,
    maxImages = 10,
    folder = 'rooms'
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const remainingSlots = maxImages - images.length
        if (remainingSlots <= 0) {
            toast.error(`Maximum ${maxImages} images allowed`)
            return
        }

        setUploading(true)
        const newImages: string[] = []

        try {
            for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
                const file = files[i]

                // For now, create local object URLs (in production, upload to Supabase Storage)
                // This is a placeholder - replace with actual upload logic
                const objectUrl = URL.createObjectURL(file)
                newImages.push(objectUrl)

                // In production, use this:
                // const formData = new FormData()
                // formData.append('file', file)
                // formData.append('folder', folder)
                // const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
                // const data = await res.json()
                // if (data.success) newImages.push(data.url)
            }

            onChange([...images, ...newImages])
            toast.success(`${newImages.length} image(s) added`)
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload images')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleUpload(e.target.files)}
                    className="hidden"
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 size={32} className="animate-spin text-amber-500" />
                        <p className="text-slate-400">Uploading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                            <Upload size={24} className="text-slate-400" />
                        </div>
                        <p className="text-slate-300">Click to upload images</p>
                        <p className="text-slate-500 text-sm">
                            {images.length}/{maxImages} images • PNG, JPG up to 5MB
                        </p>
                    </div>
                )}
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((src, index) => (
                        <div key={index} className="relative group aspect-video rounded-lg overflow-hidden bg-slate-800">
                            {src.startsWith('blob:') ? (
                                // For blob URLs, use regular img tag
                                <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                            ) : (
                                <Image
                                    src={src}
                                    alt={`Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            {index === 0 && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded">
                                    Cover
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Placeholder if no images */}
            {images.length === 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-video rounded-lg bg-slate-800/50 flex items-center justify-center">
                            <ImageIcon size={24} className="text-slate-700" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
