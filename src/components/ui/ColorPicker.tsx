import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { COLOR_SWATCHES } from '@/lib/defaults'

interface ColorPickerProps {
  value: string; onChange: (color: string) => void
  label?: string; className?: string; compact?: boolean
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label, className, compact = false }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const isTransparent = value === 'transparent' || value === ''
  const safeValue = isTransparent ? '#FFFFFF' : value

  return (
    <div className={cn('relative', className)} ref={ref}>
      {label && <label className="text-xs text-ink-muted block mb-1">{label}</label>}
      <button type="button" onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border bg-paper hover:bg-surface-raised transition-colors',
          compact ? 'h-7 px-1.5' : 'h-8 px-2'
        )}
      >
        {isTransparent ? (
          <div className="w-4 h-4 rounded border border-border/60 flex-shrink-0"
            style={{ background: 'repeating-conic-gradient(#E4E4E7 0% 25%, transparent 0% 50%) 0 0/8px 8px' }} />
        ) : (
          <div className="w-4 h-4 rounded border border-black/10 flex-shrink-0" style={{ backgroundColor: value }} />
        )}
        {!compact && <span className="text-xs font-mono text-ink-muted">{isTransparent ? 'none' : value}</span>}
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-paper border border-border rounded-xl shadow-float p-3 w-60">
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {/* Transparent option */}
            <button type="button" onClick={() => { onChange('transparent'); setOpen(false) }}
              title="Transparent"
              className={cn('w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 overflow-hidden',
                isTransparent ? 'border-accent scale-110' : 'border-transparent')}
              style={{ background: 'repeating-conic-gradient(#E4E4E7 0% 25%, #FFFFFF 0% 50%) 0 0/8px 8px' }} />
            {COLOR_SWATCHES.map(c => (
              <button key={c.value} type="button" onClick={() => { onChange(c.value); setOpen(false) }}
                title={c.name}
                className={cn('w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110',
                  value === c.value ? 'border-accent scale-110' : 'border-transparent')}
                style={{ backgroundColor: c.value }} />
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <input type="color" value={safeValue} onChange={e => onChange(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-border p-0.5 bg-paper" />
            <input type="text" value={isTransparent ? '' : value}
              onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value) }}
              className="flex-1 h-7 px-2 text-xs font-mono border border-border rounded-lg bg-surface-sunken focus:outline-none focus:ring-1 focus:ring-accent/30"
              placeholder="#000000" />
          </div>
        </div>
      )}
    </div>
  )
}
