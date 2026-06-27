import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Printer, Grid3X3, Save, RotateCcw, Moon, Sun, Laptop, Bell, Palette, Check } from 'lucide-react'
import { TopBar } from '@/components/layout/index'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { Toggle, Slider } from '@/components/ui/Controls'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { useSettingsStore } from '@/store/settingsStore'
import { useUIStore } from '@/store/uiStore'
import { useTemplateStore } from '@/store/templateStore'
import { THEMES, THEME_LIST } from '@/themes'
import { cn } from '@/utils/cn'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore()
  const { theme, setTheme, toast } = useUIStore()
  const { activeThemeId, setActiveThemeId } = useTemplateStore()
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    toast('Settings saved', 'success')
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    updateSettings({
      theme: 'light', language: 'en', defaultPageSize: 'A4',
      defaultOrientation: 'portrait', autoSave: true, autoSaveInterval: 30,
      showRulers: false, showGrid: false, snapToGrid: false, gridSize: 8,
      showMiniMap: false, reducedMotion: false, fontSize: 'md', defaultThemeId: 'minimalist',
    })
    toast('Settings reset to defaults', 'info')
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Settings" subtitle="Customize your workspace preferences"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw size={13} /> Reset</Button>
            <Button size="sm" onClick={save}>
              {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Settings</>}
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-3xl space-y-6">

          {/* Theme Packs — NEW */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette size={15} /> Theme Packs</CardTitle></CardHeader>
            <CardBody>
              <p className="text-xs text-ink-muted mb-4">Your default theme is applied across all new planners and template previews.</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {THEME_LIST.map(t => (
                  <button key={t.id} onClick={() => setActiveThemeId(t.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                      activeThemeId === t.id
                        ? 'border-primary shadow-card scale-105'
                        : 'border-border hover:border-border-strong hover:scale-102'
                    )}
                    style={{ background: t.gradient }}>
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-[10px] font-semibold leading-tight text-center" style={{ color: t.colors.primary }}>{t.name}</span>
                    <div className="flex gap-1">
                      {[t.colors.primary, t.colors.accent, t.colors.secondary].map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-full border border-white/50 shadow-xs" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    {activeThemeId === t.id && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check size={9} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Monitor size={15} /> Appearance</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-3 block">UI Color Scheme</label>
                <div className="flex gap-2">
                  {(['light', 'dark', 'system'] as const).map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all capitalize',
                        theme === t ? 'bg-primary text-white border-primary shadow-card' : 'border-border text-ink-muted hover:border-border-strong hover:text-primary bg-white')}>
                      {t === 'light' ? <Sun size={12} /> : t === 'dark' ? <Moon size={12} /> : <Laptop size={12} />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-2 block">Font Size</label>
                <div className="flex gap-2">
                  {(['sm', 'md', 'lg'] as const).map(s => (
                    <button key={s} onClick={() => updateSettings({ fontSize: s })}
                      className={cn('px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                        settings.fontSize === s ? 'bg-primary text-white border-primary shadow-card' : 'border-border text-ink-muted hover:border-border-strong bg-white')}>
                      {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle label="Reduce motion" description="Disable animations for accessibility"
                checked={settings.reducedMotion} onChange={v => updateSettings({ reducedMotion: v })} />
            </CardBody>
          </Card>

          {/* Print & Export */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Printer size={15} /> Print & Export Defaults</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select label="Default page size" value={settings.defaultPageSize}
                  onChange={v => updateSettings({ defaultPageSize: v as any })}
                  options={[
                    { value: 'A4', label: 'A4 (210 × 297 mm)' },
                    { value: 'Letter', label: 'US Letter (8.5 × 11 in)' },
                    { value: 'A5', label: 'A5 (148 × 210 mm)' },
                    { value: 'Half-Letter', label: 'Half Letter (5.5 × 8.5 in)' },
                    { value: 'Square', label: 'Square (148 × 148 mm)' },
                  ]} />
                <Select label="Default orientation" value={settings.defaultOrientation}
                  onChange={v => updateSettings({ defaultOrientation: v as any })}
                  options={[
                    { value: 'portrait', label: 'Portrait' },
                    { value: 'landscape', label: 'Landscape' },
                  ]} />
              </div>
            </CardBody>
          </Card>

          {/* Canvas */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Grid3X3 size={15} /> Canvas</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <Toggle label="Show grid" description="Display a dot or line grid overlay on the canvas"
                checked={settings.showGrid} onChange={v => updateSettings({ showGrid: v })} />
              <Toggle label="Snap to grid" description="Align blocks to the grid when dragging"
                checked={settings.snapToGrid} onChange={v => updateSettings({ snapToGrid: v })} />
              <Toggle label="Show rulers" description="Display measurement rulers along the canvas edges"
                checked={settings.showRulers} onChange={v => updateSettings({ showRulers: v })} />
              <Toggle label="Show mini-map" description="Display a mini overview of all pages"
                checked={settings.showMiniMap} onChange={v => updateSettings({ showMiniMap: v })} />
              <Slider label="Grid size" value={settings.gridSize} min={4} max={32} step={4}
                onChange={v => updateSettings({ gridSize: v })}
                formatValue={v => `${v}px`} />
            </CardBody>
          </Card>

          {/* Auto-save */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Save size={15} /> Auto-Save</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <Toggle label="Enable auto-save" description="Automatically save changes while editing"
                checked={settings.autoSave} onChange={v => updateSettings({ autoSave: v })} />
              {settings.autoSave && (
                <Slider label="Auto-save interval" value={settings.autoSaveInterval} min={10} max={120} step={10}
                  onChange={v => updateSettings({ autoSaveInterval: v })}
                  formatValue={v => `${v}s`} />
              )}
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  )
}
