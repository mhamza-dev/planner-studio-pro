import React, { useState, useRef, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import type { Toast } from '@/types'
import { useUIStore } from '@/store/uiStore'

// ── Toast System ──────────────────────────────────────────────────────────────
const ICONS = {
  success: <CheckCircle size={15} className="text-emerald-500 shrink-0"/>,
  error: <AlertCircle size={15} className="text-red-500 shrink-0"/>,
  warning: <AlertTriangle size={15} className="text-amber-500 shrink-0"/>,
  info: <Info size={15} className="text-accent shrink-0"/>,
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore()
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{opacity:0,y:16,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:0.95}}
            transition={{duration:0.2,ease:[0.16,1,0.3,1]}}
            className="pointer-events-auto flex items-start gap-2.5 bg-white border border-border rounded-xl shadow-float px-4 py-3 min-w-[260px] max-w-[360px]"
          >
            {ICONS[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary">{t.title}</p>
              {t.message && <p className="text-xs text-ink-muted mt-0.5">{t.message}</p>}
            </div>
            <button onClick={() => removeToast(t.id)} className="text-ink-faint hover:text-primary transition-colors shrink-0 mt-0.5">
              <X size={13}/>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const badgeVariants = cva('inline-flex items-center gap-1 font-medium rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary/10 text-primary',
      secondary: 'bg-surface-sunken text-ink-muted border border-border',
      accent: 'bg-accent/10 text-accent',
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      danger: 'bg-red-100 text-red-600',
      premium: 'bg-gold/15 text-gold-dark',
      outline: 'border border-border text-ink-muted bg-paper',
    },
    size: { xs: 'text-[10px] px-1.5 py-0.5', sm: 'text-xs px-2 py-0.5', md: 'text-xs px-2.5 py-1' },
  },
  defaultVariants: { variant: 'default', size: 'sm' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}
export const Badge: React.FC<BadgeProps> = ({ className, variant, size, ...props }) => (
  <span className={cn(badgeVariants({ variant, size, className }))} {...props}/>
)

// ── Tooltip ───────────────────────────────────────────────────────────────────
interface TooltipProps { content: React.ReactNode; children: React.ReactElement; side?: 'top'|'bottom'|'left'|'right'; delay?: number }
export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top', delay = 500 }) => {
  const [show, setShow] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }
  return (
    <div className="relative inline-flex"
      onMouseEnter={() => { timer.current = setTimeout(() => setShow(true), delay) }}
      onMouseLeave={() => { clearTimeout(timer.current); setShow(false) }}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.92}}
            transition={{duration:0.1}}
            className={cn('absolute z-50 pointer-events-none', positions[side])}
          >
            <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap shadow-float max-w-[200px] text-center">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Dropdown ──────────────────────────────────────────────────────────────────
export interface DropdownItem {
  label?: string; icon?: React.ReactNode; onClick?: () => void
  danger?: boolean; disabled?: boolean; separator?: boolean; description?: string
}
interface DropdownProps { trigger: React.ReactElement; items: DropdownItem[]; align?: 'left'|'right'; className?: string }
export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'left', className }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      {React.cloneElement(trigger, { onClick: (e: React.MouseEvent) => { e.stopPropagation(); setOpen(o => !o) } })}
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-4,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-4,scale:0.97}}
            transition={{duration:0.12}}
            className={cn('absolute z-50 top-full mt-1 min-w-[168px] bg-paper rounded-xl border border-border shadow-float overflow-hidden py-1', align==='right' ? 'right-0' : 'left-0')}
            role="menu"
          >
            {items.map((item, i) => item.separator
              ? <div key={i} className="h-px bg-border my-1"/>
              : (
                <button key={i} role="menuitem" disabled={item.disabled}
                  onClick={() => { item.onClick?.(); setOpen(false) }}
                  className={cn('flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm transition-colors duration-100',
                    item.danger ? 'text-red-600 hover:bg-red-50' : 'text-primary hover:bg-surface-raised',
                    item.disabled && 'opacity-40 cursor-not-allowed')}
                >
                  {item.icon && <span className="shrink-0 w-4 h-4 flex items-center justify-center text-inherit opacity-70">{item.icon}</span>}
                  <div className="min-w-0">
                    <div className="truncate">{item.label}</div>
                    {item.description && <div className="text-[11px] text-ink-muted truncate mt-0.5">{item.description}</div>}
                  </div>
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TabsCtx = createContext<{ value: string; onChange: (v: string) => void }>({ value: '', onChange: () => {} })
interface TabsProps { value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }
export const Tabs: React.FC<TabsProps> = ({ value, onChange, children, className }) => (
  <TabsCtx.Provider value={{ value, onChange }}>
    <div className={cn('flex flex-col min-h-0', className)}>{children}</div>
  </TabsCtx.Provider>
)
interface TabListProps { children: React.ReactNode; className?: string; variant?: 'pills'|'underline'|'segment' }
export const TabList: React.FC<TabListProps> = ({ children, className, variant = 'segment' }) => {
  const bases = { segment: 'bg-surface-sunken rounded-lg p-1 gap-0.5', pills: 'gap-1.5', underline: 'border-b border-border gap-1' }
  return <div className={cn('flex items-center', bases[variant], className)} role="tablist">{children}</div>
}
interface TabProps { value: string; children: React.ReactNode; icon?: React.ReactNode; className?: string; variant?: 'pills'|'underline'|'segment' }
export const Tab: React.FC<TabProps> = ({ value, children, icon, className, variant = 'segment' }) => {
  const { value: current, onChange } = useContext(TabsCtx)
  const active = current === value
  const styles = {
    segment: { base: 'px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-150', active: 'bg-paper text-primary shadow-xs', inactive: 'text-ink-muted hover:text-primary' },
    pills: { base: 'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150', active: 'bg-primary text-white', inactive: 'text-ink-muted hover:bg-surface-raised hover:text-primary' },
    underline: { base: 'px-3 py-2 text-xs font-medium transition-all duration-150 border-b-2 -mb-px', active: 'text-primary border-accent', inactive: 'text-ink-muted border-transparent hover:text-primary hover:border-border-strong' },
  }[variant]
  return (
    <button role="tab" aria-selected={active} onClick={() => onChange(value)}
      className={cn('inline-flex items-center gap-1.5', styles.base, active ? styles.active : styles.inactive, className)}>
      {icon}<span>{children}</span>
    </button>
  )
}
interface TabPanelProps { value: string; children: React.ReactNode; className?: string }
export const TabPanel: React.FC<TabPanelProps> = ({ value, children, className }) => {
  const { value: current } = useContext(TabsCtx)
  if (current !== value) return null
  return <div role="tabpanel" className={cn('min-h-0', className)}>{children}</div>
}

// ── Divider ───────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ label?: string; className?: string }> = ({ label, className }) => {
  if (label) return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-px bg-border"/>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{label}</span>
      <div className="flex-1 h-px bg-border"/>
    </div>
  )
  return <div className={cn('h-px bg-border', className)}/>
}

// ── Empty State ────────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{
  icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode; className?: string
}> = ({ icon, title, description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
    {icon && <div className="text-ink-faint/40 mb-1">{icon}</div>}
    <div>
      <p className="text-sm font-semibold text-primary">{title}</p>
      {description && <p className="text-sm text-ink-muted mt-1 max-w-xs leading-relaxed">{description}</p>}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
)

// ── Loading Spinner ────────────────────────────────────────────────────────────
export const Spinner: React.FC<{ size?: 'xs'|'sm'|'md'|'lg'; className?: string }> = ({ size = 'md', className }) => {
  const s = { xs:'w-3 h-3', sm:'w-4 h-4', md:'w-6 h-6', lg:'w-8 h-8' }[size]
  return (
    <svg className={cn('animate-spin text-ink-faint', s, className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}
