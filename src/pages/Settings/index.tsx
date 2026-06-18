import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Save, Monitor, Printer, Grid3X3, RotateCcw } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { Toggle, Slider } from '@/components/ui/Slider'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Divider } from '@/components/ui/Misc'
import { useSettingsStore } from '@/store/settingsStore'
import type { AppSettings } from '@/types'

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  defaultPageSize: z.enum(['A4', 'Letter']),
  defaultOrientation: z.enum(['portrait', 'landscape']),
  autoSave: z.boolean(),
  autoSaveInterval: z.number().min(10).max(300),
  showRulers: z.boolean(),
  showGrid: z.boolean(),
  snapToGrid: z.boolean(),
  gridSize: z.number().min(4).max(32),
})

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore()
  const [saved, setSaved] = React.useState(false)

  const { register, handleSubmit, watch, setValue, formState: { isDirty } } = useForm<AppSettings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  })

  const watchedValues = watch()

  const onSubmit = (data: AppSettings) => {
    updateSettings(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    updateSettings({
      theme: 'light',
      language: 'en',
      defaultPageSize: 'A4',
      defaultOrientation: 'portrait',
      autoSave: true,
      autoSaveInterval: 30,
      showRulers: false,
      showGrid: false,
      snapToGrid: false,
      gridSize: 8,
    })
  }

  const sections = [
    {
      icon: <Monitor size={16} />,
      title: 'Appearance',
      content: (
        <div className="space-y-4">
          <Select
            label="Theme"
            value={watchedValues.theme}
            onChange={e => setValue('theme', e.target.value as AppSettings['theme'], { shouldDirty: true })}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark (coming soon)' },
              { value: 'system', label: 'System' },
            ]}
          />
          <Select
            label="Language"
            value={watchedValues.language}
            onChange={e => setValue('language', e.target.value, { shouldDirty: true })}
            options={[
              { value: 'en', label: 'English' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
              { value: 'es', label: 'Spanish' },
              { value: 'ja', label: 'Japanese' },
            ]}
          />
        </div>
      ),
    },
    {
      icon: <Printer size={16} />,
      title: 'Default Export Settings',
      content: (
        <div className="space-y-4">
          <Select
            label="Default Page Size"
            value={watchedValues.defaultPageSize}
            onChange={e => setValue('defaultPageSize', e.target.value as 'A4' | 'Letter', { shouldDirty: true })}
            options={[
              { value: 'A4', label: 'A4 (210 × 297 mm)' },
              { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
            ]}
          />
          <Select
            label="Default Orientation"
            value={watchedValues.defaultOrientation}
            onChange={e => setValue('defaultOrientation', e.target.value as 'portrait' | 'landscape', { shouldDirty: true })}
            options={[
              { value: 'portrait', label: 'Portrait' },
              { value: 'landscape', label: 'Landscape' },
            ]}
          />
        </div>
      ),
    },
    {
      icon: <Save size={16} />,
      title: 'Auto Save',
      content: (
        <div className="space-y-4">
          <Toggle
            checked={watchedValues.autoSave}
            onChange={v => setValue('autoSave', v, { shouldDirty: true })}
            label="Enable auto save"
            description="Automatically save your work at regular intervals"
          />
          {watchedValues.autoSave && (
            <Slider
              label="Save interval"
              value={watchedValues.autoSaveInterval}
              onChange={v => setValue('autoSaveInterval', v, { shouldDirty: true })}
              min={10}
              max={300}
              step={10}
              formatValue={v => `${v}s`}
            />
          )}
        </div>
      ),
    },
    {
      icon: <Grid3X3 size={16} />,
      title: 'Canvas',
      content: (
        <div className="space-y-4">
          <Toggle
            checked={watchedValues.showRulers}
            onChange={v => setValue('showRulers', v, { shouldDirty: true })}
            label="Show rulers"
            description="Display measurement rulers on the canvas edges"
          />
          <Toggle
            checked={watchedValues.showGrid}
            onChange={v => setValue('showGrid', v, { shouldDirty: true })}
            label="Show grid"
            description="Overlay a grid on the canvas for alignment"
          />
          <Toggle
            checked={watchedValues.snapToGrid}
            onChange={v => setValue('snapToGrid', v, { shouldDirty: true })}
            label="Snap to grid"
            description="Snap elements to grid points while dragging"
          />
          {watchedValues.showGrid && (
            <Slider
              label="Grid size"
              value={watchedValues.gridSize}
              onChange={v => setValue('gridSize', v, { shouldDirty: true })}
              min={4}
              max={32}
              step={4}
              formatValue={v => `${v}px`}
            />
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Settings"
        subtitle="Configure your workspace preferences"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={14} />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit(onSubmit)}
              variant={saved ? 'brand' : 'default'}
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-xl space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-secondary">{section.icon}</span>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  {section.content}
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
