import React from 'react'
import { cn } from '@/utils/cn'

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
              'w-full rounded-lg border bg-paper px-3 text-primary placeholder:text-ink-faint/60',
              'border-border transition-colors duration-100',
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
            'w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-primary placeholder:text-ink-faint/60',
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
            'w-full rounded-lg border border-border bg-paper px-3 text-sm text-primary cursor-pointer',
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
