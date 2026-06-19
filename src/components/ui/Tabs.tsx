import React, { createContext, useContext } from 'react'
import { cn } from '@/utils/cn'

interface TabsContextValue {
  value: string
  onChange: (v: string) => void
}

const TabsContext = createContext<TabsContextValue>({ value: '', onChange: () => {} })

interface TabsProps {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ value, onChange, children, className }) => (
  <TabsContext.Provider value={{ value, onChange }}>
    <div className={cn('flex flex-col min-h-0', className)}>{children}</div>
  </TabsContext.Provider>
)

interface TabListProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'pill' | 'underline'
}

export const TabList: React.FC<TabListProps> = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-background rounded-lg p-1 gap-0.5',
    pill: 'gap-1',
    underline: 'border-b border-border gap-1',
  }

  return (
    <div
      className={cn('flex items-center', variants[variant], className)}
      role="tablist"
    >
      {children}
    </div>
  )
}

interface TabProps {
  value: string
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
  variant?: 'default' | 'pill' | 'underline'
}

export const Tab: React.FC<TabProps> = ({ value, children, icon, className, variant = 'default' }) => {
  const ctx = useContext(TabsContext)
  const isActive = ctx.value === value

  const variants = {
    default: {
      base: 'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150',
      active: 'bg-paper text-primary shadow-sm',
      inactive: 'text-secondary hover:text-primary',
    },
    pill: {
      base: 'px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-150',
      active: 'bg-primary text-white',
      inactive: 'text-secondary hover:bg-background hover:text-primary',
    },
    underline: {
      base: 'px-3 py-2 text-sm font-medium transition-all duration-150 border-b-2 -mb-px',
      active: 'text-primary border-primary',
      inactive: 'text-secondary border-transparent hover:text-primary hover:border-accent-dark',
    },
  }

  const v = variants[variant]

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={cn(
        'inline-flex items-center gap-1.5',
        v.base,
        isActive ? v.active : v.inactive,
        className
      )}
      onClick={() => ctx.onChange(value)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

interface TabPanelProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, children, className }) => {
  const ctx = useContext(TabsContext)
  if (ctx.value !== value) return null
  return (
    <div role="tabpanel" className={cn('min-h-0', className)}>
      {children}
    </div>
  )
}
