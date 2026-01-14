'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
}

export function useScrollAnimation<T extends HTMLElement>(
    options: UseScrollAnimationOptions = {}
) {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
    const ref = useRef<T>(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    if (triggerOnce) {
                        observer.unobserve(element)
                    }
                } else if (!triggerOnce) {
                    setIsInView(false)
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [threshold, rootMargin, triggerOnce])

    return { ref, isInView }
}

// Component wrapper for scroll animations
export function ScrollReveal({
    children,
    className = '',
    animation = 'slide-up',
    delay = 0,
    duration = 800,
    threshold = 0.1,
}: {
    children: React.ReactNode
    className?: string
    animation?: 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'fade' | 'scale'
    delay?: number
    duration?: number
    threshold?: number
}) {
    const { ref, isInView } = useScrollAnimation<HTMLDivElement>({ threshold })

    const getTransform = () => {
        switch (animation) {
            case 'slide-up': return 'translateY(40px)'
            case 'slide-down': return 'translateY(-40px)'
            case 'slide-left': return 'translateX(40px)'
            case 'slide-right': return 'translateX(-40px)'
            case 'scale': return 'scale(0.95)'
            default: return 'none'
        }
    }

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'none' : getTransform(),
                transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}

// Stagger children animations
export function StaggerChildren({
    children,
    className = '',
    staggerDelay = 100,
    threshold = 0.1,
}: {
    children: React.ReactNode
    className?: string
    staggerDelay?: number
    threshold?: number
}) {
    const { ref, isInView } = useScrollAnimation<HTMLDivElement>({ threshold })

    return (
        <div ref={ref} className={className}>
            {Array.isArray(children)
                ? children.map((child, index) => (
                    <div
                        key={index}
                        style={{
                            opacity: isInView ? 1 : 0,
                            transform: isInView ? 'none' : 'translateY(30px)',
                            transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)`,
                            transitionDelay: `${index * staggerDelay}ms`,
                        }}
                    >
                        {child}
                    </div>
                ))
                : children}
        </div>
    )
}

// Parallax scroll effect
export function useParallax(speed: number = 0.5) {
    const ref = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                const scrolled = window.innerHeight - rect.top
                if (scrolled > 0 && rect.bottom > 0) {
                    setOffset(scrolled * speed)
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [speed])

    return { ref, offset }
}
