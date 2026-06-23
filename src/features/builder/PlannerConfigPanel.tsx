import React from 'react'
import { Select } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Controls'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { Divider } from '@/components/ui/index'
import { usePlannerStore } from '@/store/plannerStore'
import { PALETTE_PRESETS, CURATED_FONTS } from '@/lib/defaults'
import type { Planner } from '@/types'
import { cn } from '@/utils/cn'

function Section({ title, children }: { children: React.ReactNode; title: string }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{title}</p>
      {children}
    </div>
  )
}

interface PlannerConfigPanelProps { planner: Planner }

export const PlannerConfigPanel: React.FC<PlannerConfigPanelProps> = ({ planner }) => {
  const { updateConfig, renamePlanner } = usePlannerStore()
  const cfg = planner.config
  const upd = (u: Partial<typeof cfg>) => updateConfig(planner.id, u)

  const fontCategories = ['Sans-serif', 'Serif', 'Script', 'Monospace']
  const fontsByCategory = fontCategories.reduce<Record<string, typeof CURATED_FONTS>>((acc, cat) => {
    acc[cat] = CURATED_FONTS.filter(f => f.category === cat)
    return acc
  }, {})

  return (
    <div className="p-3 space-y-4 overflow-y-auto h-full">
      {/* Name */}
      <Section title="Planner Name">
        <input
          value={planner.name}
          onChange={e => renamePlanner(planner.id, e.target.value)}
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 text-primary font-medium"
        />
      </Section>

      <Divider/>

      {/* Page setup */}
      <Section title="Page Setup">
        <Select label="Page size" value={cfg.pageSize}
          onChange={e => upd({ pageSize: e.target.value as any })}
          options={[
            {value:'A4',label:'A4 — 210×297 mm'},
            {value:'Letter',label:'Letter — 8.5×11 in'},
            {value:'A5',label:'A5 — 148×210 mm'},
            {value:'Half-Letter',label:'Half Letter — 5.5×8.5 in'},
            {value:'Square',label:'Square — 8×8 in'},
          ]}/>
        <Select label="Orientation" value={cfg.orientation}
          onChange={e => upd({ orientation: e.target.value as any })}
          options={[{value:'portrait',label:'Portrait'},{value:'landscape',label:'Landscape'}]}/>
        <Select label="Week starts on" value={String(cfg.weekStartsOn)}
          onChange={e => upd({ weekStartsOn: Number(e.target.value) as 0|1 })}
          options={[{value:'1',label:'Monday'},{value:'0',label:'Sunday'}]}/>
      </Section>

      <Divider/>

      {/* Typography */}
      <Section title="Font Family">
        <div className="space-y-1">
          {fontCategories.map(cat => (
            <div key={cat}>
              <p className="text-[9px] text-ink-faint uppercase tracking-wider mb-1">{cat}</p>
              <div className="space-y-0.5">
                {fontsByCategory[cat].map(font => (
                  <button key={font.name} onClick={() => upd({ fontFamily: font.name })}
                    className={cn(
                      'w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors',
                      cfg.fontFamily === font.name
                        ? 'bg-accent text-white font-medium'
                        : 'text-primary hover:bg-surface-raised'
                    )}
                    style={{ fontFamily: font.name }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Divider/>

      {/* Color palette */}
      <Section title="Color Palette">
        <p className="text-[10px] text-ink-muted">Presets</p>
        <div className="grid grid-cols-4 gap-1.5">
          {PALETTE_PRESETS.map(p => (
            <button key={p.name} title={p.name}
              onClick={() => upd({ primaryColor: p.primary, secondaryColor: p.secondary, accentColor: p.accent })}
              className={cn('rounded-lg overflow-hidden border-2 transition-transform hover:scale-105',
                cfg.primaryColor === p.primary ? 'border-accent scale-105' : 'border-transparent')}>
              <div style={{ backgroundColor: p.primary, height: '16px' }}/>
              <div style={{ backgroundColor: p.accent, height: '6px' }}/>
            </button>
          ))}
        </div>
        <ColorPicker label="Primary color" value={cfg.primaryColor} onChange={v => upd({ primaryColor: v })}/>
        <ColorPicker label="Secondary color" value={cfg.secondaryColor} onChange={v => upd({ secondaryColor: v })}/>
        <ColorPicker label="Accent color" value={cfg.accentColor} onChange={v => upd({ accentColor: v })}/>
      </Section>

      <Divider/>

      {/* Background */}
      <Section title="Page Background">
        <Select label="Pattern" value={cfg.backgroundPattern||'none'}
          onChange={e => upd({ backgroundPattern: e.target.value as any })}
          options={[
            {value:'none',label:'None — clean white'},
            {value:'dots',label:'Dot grid'},
            {value:'grid',label:'Grid lines'},
            {value:'lines',label:'Horizontal lines'},
            {value:'crosshatch',label:'Crosshatch'},
            {value:'diagonal',label:'Diagonal lines'},
          ]}/>
        <Select label="Border style" value={cfg.borderStyle||'none'}
          onChange={e => upd({ borderStyle: e.target.value as any })}
          options={[
            {value:'none',label:'None'},
            {value:'hairline',label:'Hairline border'},
            {value:'solid',label:'Solid border'},
            {value:'double',label:'Double border'},
            {value:'dashed',label:'Dashed border'},
            {value:'corner-marks',label:'Corner marks'},
          ]}/>
      </Section>

      <Divider/>

      {/* Header & Footer */}
      <Section title="Header & Footer">
        <div>
          <p className="text-[10px] text-ink-muted mb-1">Custom header text</p>
          <input value={cfg.headerText||''} onChange={e => upd({ headerText: e.target.value })}
            placeholder="e.g. Planner Studio Pro"
            className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
        </div>
        <div>
          <p className="text-[10px] text-ink-muted mb-1">Custom footer text</p>
          <input value={cfg.footerText||''} onChange={e => upd({ footerText: e.target.value })}
            placeholder="e.g. © 2025 Your Studio"
            className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-1 focus:ring-accent/30 text-primary"/>
        </div>
      </Section>

      <Divider/>

      {/* Options */}
      <Section title="Options">
        <Toggle label="Show page numbers" checked={cfg.showPageNumbers} onChange={v => upd({ showPageNumbers: v })} size="sm"/>
        {cfg.showPageNumbers && (
          <Select label="Number style" value={cfg.pageNumberStyle||'numeric'}
            onChange={e => upd({ pageNumberStyle: e.target.value as any })}
            options={[
              {value:'numeric',label:'Numeric — 1, 2, 3'},
              {value:'roman',label:'Roman — I, II, III'},
              {value:'alpha',label:'Alpha — A, B, C'},
            ]}/>
        )}
        <Toggle label="Show dates in footer" checked={cfg.showDates} onChange={v => upd({ showDates: v })} size="sm"/>
      </Section>

      <div className="pb-4"/>
    </div>
  )
}
