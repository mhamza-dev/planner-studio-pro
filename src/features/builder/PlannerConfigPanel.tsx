import React from 'react'
import { Select } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Slider'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { Divider } from '@/components/ui/Misc'
import { usePlannerStore } from '@/store/plannerStore'
import { PALETTE_PRESETS } from '@/lib/defaults'
import type { Planner } from '@/types'
import { cn } from '@/utils/cn'

interface PlannerConfigPanelProps {
  planner: Planner
}

export const PlannerConfigPanel: React.FC<PlannerConfigPanelProps> = ({ planner }) => {
  const { updateConfig, updatePlanner } = usePlannerStore()
  const cfg = planner.config

  const update = (updates: Partial<typeof cfg>) =>
    updateConfig(planner.id, updates)

  return (
    <div className="p-3 space-y-4 overflow-y-auto">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Page Setup</p>

      <Select
        label="Page Size"
        value={cfg.pageSize}
        onChange={e => update({ pageSize: e.target.value as 'A4' | 'Letter' })}
        options={[
          { value: 'A4', label: 'A4 (210 × 297 mm)' },
          { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
        ]}
      />

      <Select
        label="Orientation"
        value={cfg.orientation}
        onChange={e => update({ orientation: e.target.value as 'portrait' | 'landscape' })}
        options={[
          { value: 'portrait', label: 'Portrait' },
          { value: 'landscape', label: 'Landscape' },
        ]}
      />

      <Select
        label="Week Starts On"
        value={String(cfg.weekStartsOn)}
        onChange={e => update({ weekStartsOn: Number(e.target.value) as 0 | 1 })}
        options={[
          { value: '1', label: 'Monday' },
          { value: '0', label: 'Sunday' },
        ]}
      />

      <Divider />

      <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Typography</p>

      <Select
        label="Font Family"
        value={cfg.fontFamily}
        onChange={e => update({ fontFamily: e.target.value })}
        options={[
          { value: 'Inter', label: 'Inter' },
          { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
          { value: 'Playfair Display', label: 'Playfair Display' },
        ]}
      />

      <Divider />

      <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Color Palette</p>

      {/* Presets */}
      <div className="grid grid-cols-4 gap-1.5">
        {PALETTE_PRESETS.map(preset => (
          <button
            key={preset.name}
            title={preset.name}
            onClick={() => update({
              primaryColor: preset.primary,
              secondaryColor: preset.secondary,
              accentColor: preset.accent,
            })}
            className={cn(
              'rounded-lg overflow-hidden border-2 transition-transform hover:scale-105',
              cfg.primaryColor === preset.primary ? 'border-primary' : 'border-transparent'
            )}
          >
            <div style={{ backgroundColor: preset.primary, height: '20px' }} />
            <div style={{ backgroundColor: preset.accent, height: '8px' }} />
          </button>
        ))}
      </div>

      <ColorPicker
        label="Primary Color"
        value={cfg.primaryColor}
        onChange={v => update({ primaryColor: v })}
      />

      <ColorPicker
        label="Secondary Color"
        value={cfg.secondaryColor}
        onChange={v => update({ secondaryColor: v })}
      />

      <ColorPicker
        label="Accent Color"
        value={cfg.accentColor}
        onChange={v => update({ accentColor: v })}
      />

      <Divider />

      <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Options</p>

      <Toggle
        checked={cfg.showPageNumbers}
        onChange={v => update({ showPageNumbers: v })}
        label="Page numbers"
        description="Show page number in footer"
      />

      <Toggle
        checked={cfg.showDates}
        onChange={v => update({ showDates: v })}
        label="Show dates"
        description="Display current month in footer"
      />
    </div>
  )
}
