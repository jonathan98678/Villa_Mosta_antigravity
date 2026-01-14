'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'

interface RoomGalleryProps {
    images: string[]
    roomName: string
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/3] bg-neutral-800 rounded-2xl flex items-center justify-center">
                <span className="text-neutral-500">No images available</span>
            </div>
        )
    }

    const goTo = (index: number) => {
        if (index < 0) setCurrentIndex(images.length - 1)
        else if (index >= images.length) setCurrentIndex(0)
        else setCurrentIndex(index)
    }

    return (
        <>
            {/* Main Gallery */}
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800 group">
                    <Image
                        src={images[currentIndex]}
                        alt={`${roomName} - Image ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Lightbox trigger */}
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Expand size={20} />
                    </button>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => goTo(currentIndex - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => goTo(currentIndex + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {images.slice(0, 4).map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`relative aspect-[4/3] rounded-lg overflow-hidden ${currentIndex === i ? 'ring-2 ring-amber-500' : 'opacity-70 hover:opacity-100'
                                    } transition-all`}
                            >
                                <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <button
                        onClick={() => goTo(currentIndex - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div className="relative w-full max-w-5xl h-[80vh]">
                        <Image
                            src={images[currentIndex]}
                            alt={`${roomName} - Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={() => goTo(currentIndex + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronRight size={32} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    )
}
