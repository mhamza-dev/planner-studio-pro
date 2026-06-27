import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 select-none whitespace-nowrap shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-800 active:bg-primary-900 shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
        secondary: 'bg-white/80 border border-white/80 text-primary hover:bg-white active:bg-surface-sunken shadow-xs backdrop-blur',
        outline: 'border border-border bg-white/80 text-primary hover:bg-white active:bg-surface-sunken shadow-xs backdrop-blur',
        ghost: 'text-ink-muted hover:bg-white/75 hover:text-primary active:bg-surface-sunken',
        accent: 'bg-accent text-white hover:bg-accent-dark active:bg-accent-dark shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-xs',
        'danger-ghost': 'text-red-500 hover:bg-red-50 hover:text-red-600 active:bg-red-100',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs',
        link: 'text-accent underline-offset-4 hover:underline p-0 h-auto font-medium',
      },
      size: {
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-8 px-3 text-xs rounded-md',
        md: 'h-9 px-4 text-sm rounded-lg',
        lg: 'h-10 px-5 text-sm rounded-lg',
        xl: 'h-12 px-6 text-base rounded-xl',
        icon: 'h-9 w-9 rounded-lg',
        'icon-sm': 'h-7 w-7 rounded-md',
        'icon-xs': 'h-6 w-6 rounded',
        'icon-lg': 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
