'use client'

import { useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closeOnClickOutside?: boolean
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeOnClickOutside = true
}: ModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    const modal = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={closeOnClickOutside ? onClose : undefined}
            />

            {/* Modal */}
            <div className={`relative w-full ${sizes[size]} bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl animate-scale-in`}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                        <h2 className="text-xl font-medium text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Close button if no title */}
                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Content */}
                <div className="max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )

    // Use portal to render at document root
    if (typeof window !== 'undefined') {
        return createPortal(modal, document.body)
    }

    return null
}

// Sub-components for structured content
export const ModalContent = ({ className = '', children }: { className?: string; children: ReactNode }) => (
    <div className={`p-6 ${className}`}>{children}</div>
)

export const ModalFooter = ({ className = '', children }: { className?: string; children: ReactNode }) => (
    <div className={`p-6 pt-0 flex justify-end gap-3 ${className}`}>{children}</div>
)
