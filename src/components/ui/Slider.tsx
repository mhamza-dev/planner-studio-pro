import React from 'react'
import { cn } from '@/utils/cn'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  formatValue?: (v: number) => string
  className?: string
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = (v) => String(v),
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-xs font-medium text-secondary">{label}</label>}
          {showValue && <span className="text-xs text-secondary">{formatValue(value)}</span>}
        </div>
      )}
      <div className="relative flex items-center h-5">
        <div className="absolute w-full h-1.5 bg-accent rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-5"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-paper border-2 border-primary shadow-sm transition-all pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  )
}

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  size?: 'sm' | 'md'
  className?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-10 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-[22px]' },
  }
  const s = sizes[size]

  return (
    <label className={cn('flex items-start gap-3 cursor-pointer group', className)}>
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={cn(
            'relative inline-flex items-center rounded-full transition-colors duration-200',
            s.track,
            checked ? 'bg-primary' : 'bg-accent-dark'
          )}
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
        >
          <div
            className={cn(
              'absolute left-0.5 rounded-full bg-white shadow-sm transition-transform duration-200',
              s.thumb,
              checked && s.translate
            )}
          />
        </div>
      </div>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <div className="text-sm font-medium text-primary leading-none">{label}</div>}
          {description && <div className="text-xs text-secondary mt-0.5">{description}</div>}
        </div>
      )}
    </label>
  )
}
