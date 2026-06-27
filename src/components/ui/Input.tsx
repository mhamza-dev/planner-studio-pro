import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useFloatingMenu } from '@/utils/floatingMenu'

// ── Label ────────────────────────────────────────────────────────────────────
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, children, ...props }) => (
  <label className={cn('text-xs font-medium text-ink-muted block mb-1', className)} {...props}>
    {children}
  </label>
)

// ── Input ────────────────────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string
  leftIcon?: React.ReactNode; rightIcon?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, inputSize = 'md', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const heights = { sm: 'h-7 text-xs', md: 'h-9 text-sm', lg: 'h-10 text-sm' }
    return (
      <div className="flex flex-col gap-1">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-2.5 text-ink-faint pointer-events-none flex items-center">{leftIcon}</span>}
          <input
            id={inputId} ref={ref}
            className={cn(
              'w-full rounded-lg border bg-white/85 px-3 text-primary placeholder:text-ink-faint/70 shadow-xs backdrop-blur',
              'border-white/80 transition-colors duration-100',
              'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50',
              'disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-60',
              heights[inputSize],
              leftIcon && 'pl-8', rightIcon && 'pr-8',
              error && 'border-red-400 focus:ring-red-200 focus:border-red-400',
              className
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-2.5 text-ink-faint flex items-center">{rightIcon}</span>}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ── Textarea ─────────────────────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string; hint?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div className="flex flex-col gap-1">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <textarea
          id={inputId} ref={ref}
          className={cn(
            'w-full rounded-lg border border-white/80 bg-white/85 px-3 py-2 text-sm text-primary placeholder:text-ink-faint/70 shadow-xs backdrop-blur',
            'transition-colors duration-100 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50',
            'disabled:bg-surface-sunken disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-200',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ── Select ────────────────────────────────────────────────────────────────────
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; hint?: string
  options: { label: string; value: string; disabled?: boolean }[]
  selectSize?: 'sm' | 'md'
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, id, selectSize = 'md', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div className="flex flex-col gap-1">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <select
          id={inputId} ref={ref}
          className={cn(
            'w-full rounded-lg border border-white/80 bg-white/85 px-3 text-sm text-primary cursor-pointer shadow-xs backdrop-blur',
            'transition-colors duration-100 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50',
            selectSize === 'sm' ? 'h-7 text-xs' : 'h-9',
            error && 'border-red-400 focus:ring-red-200',
            className
          )}
          {...props}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// ── Custom Select ────────────────────────────────────────────────────────────
export interface CustomSelectOption {
  label: string
  value: string
  description?: string
  icon?: React.ReactNode
}

export interface CustomSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: CustomSelectOption[]
  placeholder?: string
  className?: string
  buttonClassName?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label, value, onChange, options, placeholder = 'Select...', className, buttonClassName,
}) => {
  const [open, setOpen] = useState(false)
  const { containerRef, menuRef, menuStyle, isOutside } = useFloatingMenu(open, 'left', true)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (isOutside(e.target as Node)) setOpen(false) }
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', h)
    document.addEventListener('keydown', k)
    return () => {
      document.removeEventListener('mousedown', h)
      document.removeEventListener('keydown', k)
    }
  }, [isOutside])

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && <Label>{label}</Label>}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-white/80 bg-white/90 px-3 text-left text-sm text-primary shadow-xs backdrop-blur transition-all',
          'hover:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30',
          open && 'ring-2 ring-accent/25',
          buttonClassName,
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon && <span className="shrink-0 text-ink-muted">{selected.icon}</span>}
          <span className={cn('truncate font-medium', !selected && 'text-ink-faint')}>{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown size={14} className={cn('shrink-0 text-ink-faint transition-transform', open && 'rotate-180 text-accent')}/>
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              style={menuStyle}
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-72 overflow-y-auto rounded-xl border border-white/80 bg-white/95 p-1.5 shadow-float backdrop-blur-xl"
              role="listbox"
            >
              {options.map(option => {
                const active = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => { onChange(option.value); setOpen(false) }}
                    className={cn(
                      'group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                      active ? 'bg-accent/10 text-accent' : 'text-primary hover:bg-primary hover:text-white',
                    )}
                  >
                    <span className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border',
                      active ? 'border-blue-100 bg-blue-50 text-accent' : 'border-border bg-white text-ink-muted group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white',
                    )}>
                      {active ? <Check size={13}/> : option.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{option.label}</span>
                      {option.description && <span className="block truncate text-[10px] text-ink-muted group-hover:text-white/65">{option.description}</span>}
                    </span>
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

// ── Inline number spinner ─────────────────────────────────────────────────────
export interface SpinnerProps {
  label?: string; value: number; onChange: (v: number) => void
  min?: number; max?: number; step?: number; suffix?: string
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  label, value, onChange, min = 0, max = 999, step = 1, suffix = '', className,
}) => (
  <div className={cn('flex items-center justify-between gap-2', className)}>
    {label && <span className="text-xs text-ink-muted flex-1 min-w-0 truncate">{label}</span>}
    <div className="flex items-center border border-border rounded-lg overflow-hidden bg-paper shrink-0">
      <button type="button" onClick={() => onChange(Math.max(min, value - step))}
        className="w-7 h-7 flex items-center justify-center text-ink-muted hover:bg-surface-raised hover:text-primary transition-colors text-base leading-none">−</button>
      <span className="min-w-[2.5rem] text-center text-xs font-semibold text-primary px-1 tabular-nums">{value}{suffix}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + step))}
        className="w-7 h-7 flex items-center justify-center text-ink-muted hover:bg-surface-raised hover:text-primary transition-colors text-base leading-none">+</button>
    </div>
  </div>
)
