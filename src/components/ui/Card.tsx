import { forwardRef, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outline'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
    className = '',
    variant = 'default',
    padding = 'md',
    hover = false,
    children,
    ...props
}, ref) => {
    const variants = {
        default: 'bg-neutral-900 border border-neutral-800',
        glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
        outline: 'border border-neutral-800'
    }

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    }

    const hoverStyles = hover ? 'hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300' : ''

    return (
        <div
            ref={ref}
            className={`rounded-xl ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
})

Card.displayName = 'Card'

export const CardHeader = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`border-b border-neutral-800 pb-4 mb-4 ${className}`} {...props}>{children}</div>
)

export const CardTitle = ({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`text-lg font-medium text-white ${className}`} {...props}>{children}</h3>
)

export const CardDescription = ({ className = '', children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-neutral-400 mt-1 ${className}`} {...props}>{children}</p>
)

export const CardContent = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={className} {...props}>{children}</div>
)

export const CardFooter = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`border-t border-neutral-800 pt-4 mt-4 ${className}`} {...props}>{children}</div>
)

export default Card
