import React from 'react'
import { cn } from '@/utils/cn'

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle, actions, className }) => {
  return (
    <div className={cn('h-14 flex items-center justify-between px-6 border-b border-border bg-paper flex-shrink-0', className)}>
      <div>
        <h1 className="text-base font-semibold text-primary leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
