import React from 'react'
import { cn } from '@/utils/cn'

// ── Toggle ────────────────────────────────────────────────────────────────────
export interface ToggleProps {
  checked: boolean; onChange: (v: boolean) => void
  label?: string; description?: string; size?: 'sm' | 'md'; disabled?: boolean; className?: string
}
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description, size = 'md', disabled, className }) => {
  const s = size === 'sm'
    ? { track: 'w-8 h-4', thumb: 'w-3 h-3', on: 'translate-x-4' }
    : { track: 'w-10 h-5', thumb: 'w-3.5 h-3.5', on: 'translate-x-[22px]' }
  return (
    <label className={cn('flex items-start gap-2.5 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <div className="shrink-0 mt-0.5" onClick={() => !disabled && onChange(!checked)}>
        <div className={cn('relative inline-flex items-center rounded-full transition-colors duration-200', s.track, checked ? 'bg-accent' : 'bg-border-strong')}>
          <div className={cn('absolute left-0.5 rounded-full bg-white shadow-xs transition-transform duration-200', s.thumb, checked && s.on)} />
        </div>
      </div>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <div className="text-sm font-medium text-primary leading-none">{label}</div>}
          {description && <div className="text-xs text-ink-muted mt-0.5 leading-relaxed">{description}</div>}
        </div>
      )}
    </label>
  )
}

// ── Slider ────────────────────────────────────────────────────────────────────
export interface SliderProps {
  value: number; onChange: (v: number) => void
  min?: number; max?: number; step?: number
  label?: string; showValue?: boolean; formatValue?: (v: number) => string; className?: string
}
export const Slider: React.FC<SliderProps> = ({
  value, onChange, min = 0, max = 100, step = 1,
  label, showValue = true, formatValue = v => String(v), className,
}) => {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-ink-muted">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-primary tabular-nums">{formatValue(value)}</span>}
        </div>
      )}
      <div className="relative flex items-center h-4">
        <div className="absolute w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-4" />
        <div className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-accent shadow-sm pointer-events-none transition-all"
          style={{ left: `calc(${pct}% - 7px)` }} />
      </div>
    </div>
  )
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
export interface CheckboxProps {
  checked: boolean; onChange: (v: boolean) => void
  label?: string; disabled?: boolean; className?: string
}
export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled, className }) => (
  <label className={cn('flex items-center gap-2 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
    <div
      className={cn('w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors duration-150',
        checked ? 'bg-accent border-accent' : 'border-border bg-paper hover:border-accent/60')}
      onClick={() => !disabled && onChange(!checked)}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
    {label && <span className="text-sm text-primary">{label}</span>}
  </label>
)

// ── Radio group ────────────────────────────────────────────────────────────────
export interface RadioGroupProps {
  value: string; onChange: (v: string) => void
  options: { label: string; value: string; description?: string }[]
  orientation?: 'horizontal' | 'vertical'; className?: string
}
export const RadioGroup: React.FC<RadioGroupProps> = ({ value, onChange, options, orientation = 'vertical', className }) => (
  <div className={cn('flex gap-2', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap', className)}>
    {options.map(opt => (
      <label key={opt.value} className="flex items-start gap-2 cursor-pointer">
        <div className={cn('mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
          value === opt.value ? 'border-accent' : 'border-border')}
          onClick={() => onChange(opt.value)}>
          {value === opt.value && <div className="w-2 h-2 rounded-full bg-accent" />}
        </div>
        <div>
          <div className="text-sm font-medium text-primary leading-tight">{opt.label}</div>
          {opt.description && <div className="text-xs text-ink-muted mt-0.5">{opt.description}</div>}
        </div>
      </label>
    ))}
  </div>
)
