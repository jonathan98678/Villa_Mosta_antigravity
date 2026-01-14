import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className = '',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500',
        secondary: 'border border-neutral-700 text-white hover:bg-neutral-800 focus:ring-neutral-500',
        ghost: 'text-neutral-400 hover:text-white hover:bg-neutral-800 focus:ring-neutral-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    }

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {children}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
