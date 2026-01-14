'use client'

import { useEffect } from 'react'

export default function HomeClient() {
    useEffect(() => {
        // Intersection Observer for scroll animations
        const animatedElements = document.querySelectorAll('[data-animate]')

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated')
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        )

        animatedElements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    // This component only handles client-side effects, doesn't render anything
    return null
}
