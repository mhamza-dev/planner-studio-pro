import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileImage, FileText, Printer, CheckCircle, AlertCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { Slider, Toggle } from '@/components/ui/Slider'
import { useExportStore } from '@/store/exportStore'
import { usePlannerStore } from '@/store/plannerStore'
import { exportPlanner } from './exportEngine'
import { generateId } from '@/utils/id'
import type { ExportFormat } from '@/types'

interface ExportModalProps {
  open: boolean
  onClose: () => void
  pageRefs: React.RefObject<HTMLElement[]>
}

export const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, pageRefs }) => {
  const { config, setConfig, isExporting, exportProgress, exportError, setIsExporting, setExportProgress, setExportError, addDownload } = useExportStore()
  const { getActivePlanner } = usePlannerStore()
  const [done, setDone] = useState(false)

  const planner = getActivePlanner()

  const formatOptions = [
    { value: 'pdf', label: 'PDF — Print Ready' },
    { value: 'png', label: 'PNG — Lossless Image' },
    { value: 'jpg', label: 'JPG — Compressed Image' },
  ]

  const resolutionOptions = [
    { value: '72', label: '72 DPI — Web' },
    { value: '150', label: '150 DPI — Standard Print' },
    { value: '300', label: '300 DPI — High Quality Print' },
  ]

  const pageSizeOptions = [
    { value: 'A4', label: 'A4 (210 × 297 mm)' },
    { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
  ]

  const handleExport = async () => {
    if (!planner || !pageRefs.current?.length) return
    setIsExporting(true)
    setExportError(null)
    setDone(false)

    try {
      await exportPlanner(
        planner,
        pageRefs.current.filter(Boolean) as HTMLElement[],
        config,
        (progress) => setExportProgress(Math.round((progress.current / progress.total) * 100))
      )

      addDownload({
        id: generateId('dl'),
        plannerId: planner.id,
        plannerName: planner.name,
        format: config.format,
        fileSize: 0,
        createdAt: new Date().toISOString(),
      })

      setDone(true)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Planner"
      description="Choose your format and quality settings"
      size="md"
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button
            variant="ghost"
            size="md"
            onClick={handlePrint}
          >
            <Printer size={16} />
            Print
          </Button>
          <Button
            size="md"
            onClick={handleExport}
            loading={isExporting}
            disabled={isExporting}
          >
            <Download size={16} />
            {isExporting ? `Exporting ${exportProgress}%` : 'Export'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Format selector */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'pdf', label: 'PDF', icon: <FileText size={20} />, desc: 'Print ready' },
            { value: 'png', label: 'PNG', icon: <FileImage size={20} />, desc: 'Lossless' },
            { value: 'jpg', label: 'JPG', icon: <FileImage size={20} />, desc: 'Compressed' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setConfig({ format: f.value as ExportFormat })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                config.format === f.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-accent-dark'
              }`}
            >
              <span className={config.format === f.value ? 'text-primary' : 'text-secondary'}>
                {f.icon}
              </span>
              <div className="font-semibold text-sm">{f.label}</div>
              <div className="text-xs text-secondary">{f.desc}</div>
            </button>
          ))}
        </div>

        {/* Page size */}
        <Select
          label="Page Size"
          value={config.pageSize}
          onChange={e => setConfig({ pageSize: e.target.value as 'A4' | 'Letter' })}
          options={pageSizeOptions}
        />

        {/* Resolution */}
        <Select
          label="Resolution"
          value={String(config.resolution)}
          onChange={e => setConfig({ resolution: Number(e.target.value) as 72 | 150 | 300 })}
          options={resolutionOptions}
        />

        {/* Quality - only for JPG */}
        {config.format === 'jpg' && (
          <Slider
            label="Quality"
            value={config.quality}
            onChange={v => setConfig({ quality: v })}
            min={60}
            max={100}
            step={5}
            formatValue={v => `${v}%`}
          />
        )}

        {/* Options */}
        <div className="space-y-3 pt-1">
          <Toggle
            checked={config.includeBleed}
            onChange={v => setConfig({ includeBleed: v })}
            label="Include bleed marks"
            description="Add 3mm bleed for professional printing"
          />
        </div>

        {/* Progress */}
        {isExporting && (
          <div className="rounded-lg bg-background p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Exporting...</span>
              <span className="text-sm text-secondary">{exportProgress}%</span>
            </div>
            <div className="h-2 bg-accent rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${exportProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Export complete! File saved to your downloads.</span>
          </div>
        )}

        {exportError && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
            <AlertCircle size={16} />
            <span className="text-sm">{exportError}</span>
          </div>
        )}
      </div>
    </Modal>
  )
}
