import React from 'react'
import { cn } from '@/utils/cn'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className,
}) => {
  if (orientation === 'vertical') {
    return <div className={cn('w-px bg-border self-stretch', className)} />
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-3 my-2', className)}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-secondary font-medium">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    )
  }

  return <div className={cn('h-px w-full bg-border', className)} />
}

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'md', className }) => {
  const sizes = { xs: 'h-2', sm: 'h-4', md: 'h-6', lg: 'h-8', xl: 'h-12' }
  return <div className={cn(sizes[size], className)} aria-hidden="true" />
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
    {icon && (
      <div className="text-secondary/40 mb-2">{icon}</div>
    )}
    <div>
      <p className="text-sm font-medium text-primary">{title}</p>
      {description && (
        <p className="text-sm text-secondary mt-1 max-w-xs">{description}</p>
      )}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
)

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <svg
      className={cn('animate-spin text-secondary', sizes[size], className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
