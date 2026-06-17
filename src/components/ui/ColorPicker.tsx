import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  presets?: string[]
  className?: string
}

const DEFAULT_PRESETS = [
  '#111827', '#374151', '#6B7280', '#9CA3AF',
  '#2D4A22', '#4A7C59', '#8B9D77', '#C8D5B9',
  '#4A1942', '#8B4B6E', '#C084A8', '#F2C4CE',
  '#0C2340', '#1B5E8C', '#4A90C4', '#B8D4E8',
  '#3D1A08', '#8B3A00', '#C97B3E', '#F2C49B',
  '#2D1B69', '#6B5B95', '#9B8EC4', '#D4C5F9',
  '#D6CFC7', '#B8AFA5', '#FFFFFF', '#000000',
]

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  presets = DEFAULT_PRESETS,
  className,
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className={cn('relative', className)} ref={ref}>
      {label && (
        <label className="text-xs font-medium text-secondary mb-1 block">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-8 px-2 rounded-md border border-border bg-paper hover:bg-background transition-colors text-sm"
        aria-label={`Color picker: ${value}`}
      >
        <span
          className="w-4 h-4 rounded-sm border border-border/60 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <span className="text-xs text-secondary font-mono">{value}</span>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-paper border border-border rounded-xl shadow-modal p-3 w-56">
          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {presets.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => { onChange(color); setOpen(false) }}
                className={cn(
                  'w-6 h-6 rounded-md border-2 transition-transform hover:scale-110',
                  value === color ? 'border-primary/60 scale-110' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              value={value}
              onChange={e => {
                if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                  onChange(e.target.value)
                }
              }}
              className="flex-1 h-7 px-2 text-xs font-mono border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  )
}
