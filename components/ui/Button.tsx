'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-btn transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none'
    const variants = {
      primary: 'bg-accent text-white hover:bg-accent-hover',
      ghost: 'bg-transparent border border-white/[0.12] text-text-primary hover:bg-bg-tertiary',
      danger: 'bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20',
    }
    const sizes = {
      sm: 'px-3 h-8 text-sm',
      md: 'px-4 h-10 text-sm',
      lg: 'px-6 h-12 text-base',
    }
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
