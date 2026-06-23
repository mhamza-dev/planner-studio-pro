import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Printer, Grid3X3, Save, RotateCcw, Moon, Sun, Laptop, Bell, Palette } from 'lucide-react'
import { TopBar } from '@/components/layout/index'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { Toggle, Slider } from '@/components/ui/Controls'
import { Spinner } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { useSettingsStore } from '@/store/settingsStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils/cn'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore()
  const { theme, setTheme, toast } = useUIStore()
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
      showMiniMap: false, reducedMotion: false, fontSize: 'md',
    })
    toast('Settings reset to defaults', 'info')
  }

  const sections = [
    {
      icon: <Monitor size={16}/>,
      title: 'Appearance',
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-ink-muted mb-2">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value:'light', label:'Light', icon:<Sun size={14}/> },
                { value:'dark', label:'Dark', icon:<Moon size={14}/> },
                { value:'system', label:'System', icon:<Laptop size={14}/> },
              ].map(t => (
                <button key={t.value} onClick={() => setTheme(t.value as any)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all',
                    theme === t.value ? 'border-accent bg-accent/5 text-accent' : 'border-border text-ink-muted hover:border-border-strong'
                  )}>
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Select label="Language" value={settings.language}
            onChange={e => updateSettings({ language: e.target.value })}
            options={[
              {value:'en',label:'English'}, {value:'es',label:'Español'},
              {value:'fr',label:'Français'}, {value:'de',label:'Deutsch'},
              {value:'ja',label:'日本語'}, {value:'zh',label:'中文'},
            ]}/>

          <div>
            <p className="text-xs text-ink-muted mb-2">Interface font size</p>
            <div className="grid grid-cols-3 gap-2">
              {(['sm','md','lg'] as const).map(s => (
                <button key={s} onClick={() => updateSettings({ fontSize: s })}
                  className={cn('py-1.5 rounded-lg border-2 text-xs font-medium transition-all',
                    settings.fontSize===s ? 'border-accent bg-accent/5 text-accent' : 'border-border text-ink-muted hover:border-border-strong')}>
                  {s === 'sm' ? 'Small' : s === 'md' ? 'Default' : 'Large'}
                </button>
              ))}
            </div>
          </div>

          <Toggle label="Reduce motion" description="Disable animations for accessibility"
            checked={settings.reducedMotion ?? false}
            onChange={v => updateSettings({ reducedMotion: v })} size="sm"/>
        </div>
      ),
    },
    {
      icon: <Printer size={16}/>,
      title: 'Export Defaults',
      content: (
        <div className="space-y-4">
          <Select label="Default page size" value={settings.defaultPageSize}
            onChange={e => updateSettings({ defaultPageSize: e.target.value as any })}
            options={[
              {value:'A4',label:'A4 — 210×297 mm'},
              {value:'Letter',label:'Letter — 8.5×11 in'},
              {value:'A5',label:'A5 — 148×210 mm'},
              {value:'Half-Letter',label:'Half Letter — 5.5×8.5 in'},
            ]}/>
          <Select label="Default orientation" value={settings.defaultOrientation}
            onChange={e => updateSettings({ defaultOrientation: e.target.value as any })}
            options={[{value:'portrait',label:'Portrait'},{value:'landscape',label:'Landscape'}]}/>
        </div>
      ),
    },
    {
      icon: <Save size={16}/>,
      title: 'Auto Save',
      content: (
        <div className="space-y-4">
          <Toggle label="Enable auto save" description="Automatically save your work at regular intervals"
            checked={settings.autoSave} onChange={v => updateSettings({ autoSave: v })} size="sm"/>
          {settings.autoSave && (
            <Slider label="Save interval" value={settings.autoSaveInterval}
              onChange={v => updateSettings({ autoSaveInterval: v })}
              min={10} max={300} step={10} formatValue={v => `${v}s`}/>
          )}
        </div>
      ),
    },
    {
      icon: <Grid3X3 size={16}/>,
      title: 'Canvas',
      content: (
        <div className="space-y-4">
          <Toggle label="Show rulers" description="Display measurement rulers on canvas edges"
            checked={settings.showRulers} onChange={v => updateSettings({ showRulers: v })} size="sm"/>
          <Toggle label="Show grid" description="Overlay a reference grid on the canvas"
            checked={settings.showGrid} onChange={v => updateSettings({ showGrid: v })} size="sm"/>
          <Toggle label="Snap to grid" description="Snap elements to grid points while moving"
            checked={settings.snapToGrid} onChange={v => updateSettings({ snapToGrid: v })} size="sm"/>
          {settings.showGrid && (
            <Slider label="Grid size" value={settings.gridSize}
              onChange={v => updateSettings({ gridSize: v })}
              min={4} max={32} step={4} formatValue={v => `${v}px`}/>
          )}
          <Toggle label="Show mini-map" description="Thumbnail navigator for multi-page planners"
            checked={settings.showMiniMap ?? false} onChange={v => updateSettings({ showMiniMap: v })} size="sm"/>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Settings"
        subtitle="Configure your workspace preferences"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={reset}><RotateCcw size={13}/> Reset</Button>
            <Button size="sm" variant={saved ? 'success' : 'default'} onClick={save}>
              <Save size={13}/> {saved ? 'Saved!' : 'Save'}
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-xl space-y-4">
          {sections.map((section, i) => (
            <motion.div key={section.title}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-ink-muted">{section.icon}</span>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardBody>{section.content}</CardBody>
              </Card>
            </motion.div>
          ))}

          {/* App info */}
          <div className="text-center py-4 space-y-1">
            <p className="text-xs text-ink-faint font-medium">Planner Studio Pro</p>
            <p className="text-[10px] text-ink-faint">Version 1.0.0 · Built with React + Vite</p>
          </div>
        </div>
      </div>
    </div>
  )
}
