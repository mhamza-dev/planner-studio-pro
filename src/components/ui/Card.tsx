import React from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean; selected?: boolean; padding?: 'none'|'sm'|'md'|'lg'
}
export const Card: React.FC<CardProps> = ({ className, hover, selected, padding = 'md', children, ...props }) => (
  <div className={cn(
    'glass-panel rounded-xl',
    { 'p-3':padding==='sm', 'p-4':padding==='md', 'p-6':padding==='lg' },
    hover && 'transition-all duration-200 cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 hover:bg-white',
    selected && 'ring-2 ring-accent/50 border-accent/40',
    className
  )} {...props}>{children}</div>
)

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-1 pb-4 border-b border-border', className)} {...props}/>
)
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={cn('text-sm font-semibold text-primary', className)} {...props}>{children}</h3>
)
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-xs text-ink-muted', className)} {...props}/>
)
export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('pt-4', className)} {...props}/>
)
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center gap-2 pt-4 mt-4 border-t border-border', className)} {...props}/>
)
