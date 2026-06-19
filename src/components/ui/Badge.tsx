import React from 'react'
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-accent text-secondary',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        premium: 'bg-brand-gold/15 text-brand-gold',
        info: 'bg-blue-100 text-blue-700',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, size, children, ...props }) => (
  <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
    {children}
  </span>
)

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void
}

export const Tag: React.FC<TagProps> = ({ className, children, onRemove, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 text-xs font-medium bg-background text-secondary',
      'border border-border rounded-md px-2 py-0.5',
      className
    )}
    {...props}
  >
    {children}
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-0.5 text-secondary/60 hover:text-secondary transition-colors"
        aria-label="Remove tag"
      >
        ×
      </button>
    )}
  </span>
)

interface DotProps {
  color?: string
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  className?: string
}

export const Dot: React.FC<DotProps> = ({ color = '#D6CFC7', size = 'md', pulse, className }) => {
  const sizes = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-2.5 h-2.5' }
  return (
    <span
      className={cn('inline-block rounded-full flex-shrink-0', sizes[size], pulse && 'animate-pulse-soft', className)}
      style={{ backgroundColor: color }}
    />
  )
}
