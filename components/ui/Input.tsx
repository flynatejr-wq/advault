import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 px-3 rounded-input bg-bg-tertiary border border-white/[0.08]',
            'text-text-primary placeholder:text-text-tertiary text-sm',
            'focus:border-accent focus:outline-none transition-colors duration-150',
            error && 'border-danger focus:border-danger',
            className
          )}
          {...props}
        />
        {error && <p className="text-danger text-xs">{error}</p>}
        {hint && !error && <p className="text-text-tertiary text-xs">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input }
