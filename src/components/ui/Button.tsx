import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-800 active:bg-primary-900 shadow-sm',
        secondary: 'bg-accent text-primary hover:bg-accent-dark active:bg-accent-dark shadow-sm',
        outline: 'border border-border bg-paper text-primary hover:bg-background active:bg-accent',
        ghost: 'text-secondary hover:bg-background hover:text-primary active:bg-accent',
        destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
        brand: 'bg-brand-sage text-white hover:bg-[#7a8d68] active:bg-[#6b7e5a] shadow-sm',
      },
      size: {
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-8 px-3 text-sm rounded',
        md: 'h-9 px-4 text-sm rounded-md',
        lg: 'h-11 px-6 text-base rounded-lg',
        xl: 'h-13 px-8 text-base rounded-xl',
        icon: 'h-9 w-9 rounded-md',
        'icon-sm': 'h-7 w-7 rounded',
        'icon-lg': 'h-11 w-11 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
