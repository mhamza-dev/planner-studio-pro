import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, FileImage, Printer, CheckCircle, AlertCircle, Eye } from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { toPng, toJpeg } from 'html-to-image'
import { saveAs } from 'file-saver'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Controls'
import { Select, Spinner } from '@/components/ui/Input'
import { useExportStore } from '@/store/exportStore'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { generateId } from '@/utils/id'
import type { ExportFormat } from '@/types'

// ── Export engine ─────────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? { r: parseInt(r[1], 16) / 255, g: parseInt(r[2], 16) / 255, b: parseInt(r[3], 16) / 255 } : { r: 0, g: 0, b: 0 }
}

async function exportToPDF(
  elements: HTMLElement[], filename: string, pageSize: 'A4' | 'Letter',
  resolution: number, onProgress: (n: number, total: number) => void
) {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const [w, h] = pageSize === 'A4' ? [595.28, 841.89] : [612, 792]
  const scale = resolution === 300 ? 4 : resolution === 150 ? 2 : 1

  for (let i = 0; i < elements.length; i++) {
    onProgress(i + 1, elements.length + 1)
    const dataUrl = await toPng(elements[i], { pixelRatio: scale, cacheBust: true, quality: 1 })
    const imgBytes = await fetch(dataUrl).then(r => r.arrayBuffer())
    const img = await doc.embedPng(imgBytes)
    const page = doc.addPage([w, h])
    page.drawImage(img, { x: 0, y: 0, width: w, height: h })
  }

  onProgress(elements.length + 1, elements.length + 1)
  const bytes = await doc.save()
  saveAs(new Blob([Uint8Array.from(bytes)], { type: 'application/pdf' }), `${filename}.pdf`)
}

async function exportToImages(
  elements: HTMLElement[], filename: string, format: 'png' | 'jpg',
  resolution: number, quality: number, onProgress: (n: number, total: number) => void
) {
  const scale = resolution === 300 ? 4 : resolution === 150 ? 2 : 1
  for (let i = 0; i < elements.length; i++) {
    onProgress(i + 1, elements.length)
    const suffix = elements.length > 1 ? `-p${i + 1}` : ''
    const dataUrl = format === 'jpg'
      ? await toJpeg(elements[i], { pixelRatio: scale, quality: quality / 100, backgroundColor: '#FFFFFF' })
      : await toPng(elements[i], { pixelRatio: scale, cacheBust: true })
    const blob = await fetch(dataUrl).then(r => r.blob())
    saveAs(blob, `${filename}${suffix}.${format}`)
  }
}

// ── Modal component ───────────────────────────────────────────────────────────
interface ExportModalProps {
  open: boolean; onClose: () => void
  pageRefs: React.RefObject<HTMLElement[]>
}

export const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, pageRefs }) => {
  const { config, setConfig, addDownload } = useExportStore()
  const { getActivePlanner, getActivePage } = usePlannerStore()
  const { toast } = useUIStore()
  const { trackExport } = useAnalyticsStore()
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customFilename, setCustomFilename] = useState('')

  const planner = getActivePlanner()
  const activePage = getActivePage()

  const handleExport = async () => {
    if (!planner || !pageRefs.current?.length) return
    setIsExporting(true); setError(null); setDone(false); setProgress(0)

    const filename = customFilename.trim() || planner.name.replace(/\s+/g, '-')
    const elements = (() => {
      const all = pageRefs.current.filter(Boolean) as HTMLElement[]
      if (config.scope === 'current' && activePage) {
        const idx = planner.pages.findIndex(p => p.id === activePage.id)
        return idx >= 0 ? [all[idx]].filter(Boolean) : all
      }
      if (config.scope === 'range' && config.pageRange) {
        return all.slice(config.pageRange[0] - 1, config.pageRange[1])
      }
      return all
    })()

    try {
      if (config.format === 'pdf') {
        await exportToPDF(elements, filename, config.pageSize as 'A4' | 'Letter', config.resolution,
          (n, t) => { setProgress(n); setTotal(t) })
      } else {
        await exportToImages(elements, filename, config.format as 'png' | 'jpg',
          config.resolution, config.quality,
          (n, t) => { setProgress(n); setTotal(t) })
      }
      addDownload({ id: generateId('dl'), plannerId: planner.id, plannerName: planner.name,
        format: config.format, fileSize: 0, pageCount: elements.length, createdAt: new Date().toISOString() })
      trackExport()
      setDone(true)
      toast('Export complete!', 'success', `Saved as ${filename}.${config.format}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Export failed'
      setError(msg); toast(msg, 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const progressPct = total > 0 ? Math.round((progress / total) * 100) : 0

  return (
    <Modal open={open} onClose={onClose} title="Export Planner"
      description="Configure your export format and quality"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            <Printer size={14}/> Print
          </Button>
          <Button size="sm" onClick={handleExport} loading={isExporting} disabled={isExporting}>
            <Download size={14}/>
            {isExporting ? `Exporting ${progressPct}%` : 'Export'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Format picker */}
        <div className="grid grid-cols-3 gap-2">
          {([
            { fmt: 'pdf', label: 'PDF', desc: 'Print-ready', icon: <FileText size={18}/> },
            { fmt: 'png', label: 'PNG', desc: 'Lossless', icon: <FileImage size={18}/> },
            { fmt: 'jpg', label: 'JPG', desc: 'Compressed', icon: <FileImage size={18}/> },
          ] as const).map(({ fmt, label, desc, icon }) => (
            <button key={fmt} onClick={() => setConfig({ format: fmt as ExportFormat })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                config.format === fmt ? 'border-accent bg-accent/5 text-accent' : 'border-border hover:border-border-strong text-ink-muted'}`}>
              {icon}
              <div className="font-semibold text-xs text-primary">{label}</div>
              <div className="text-[10px] text-ink-muted">{desc}</div>
            </button>
          ))}
        </div>

        {/* Filename */}
        <div>
          <label className="text-xs text-ink-muted block mb-1">Filename</label>
          <input value={customFilename} onChange={e => setCustomFilename(e.target.value)}
            placeholder={planner?.name.replace(/\s+/g, '-') || 'planner'}
            className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 text-primary"/>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Page size" value={config.pageSize}
            onChange={e => setConfig({ pageSize: e.target.value as any })}
            options={[{value:'A4',label:'A4'},{value:'Letter',label:'Letter'},{value:'A5',label:'A5'},{value:'Half-Letter',label:'Half Letter'}]}/>
          <Select label="Resolution" value={String(config.resolution)}
            onChange={e => setConfig({ resolution: Number(e.target.value) as any })}
            options={[{value:'72',label:'72 DPI — Screen'},{value:'150',label:'150 DPI — Print'},{value:'300',label:'300 DPI — High Res'}]}/>
        </div>

        <Select label="Export scope" value={config.scope || 'all'}
          onChange={e => setConfig({ scope: e.target.value as any })}
          options={[
            {value:'all',label:'All pages'},
            {value:'current',label:'Current page only'},
          ]}/>

        {config.format === 'jpg' && (
          <div>
            <label className="text-xs text-ink-muted block mb-1">Quality: {config.quality}%</label>
            <input type="range" min={60} max={100} step={5} value={config.quality}
              onChange={e => setConfig({ quality: Number(e.target.value) })}
              className="w-full accent-accent"/>
          </div>
        )}

        <Toggle checked={config.includeBleed} onChange={v => setConfig({ includeBleed: v })}
          label="Include bleed marks" description="Add 3mm bleed for professional printing"/>

        {/* Progress */}
        {isExporting && (
          <div className="rounded-xl bg-surface-sunken p-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-ink-muted font-medium">Rendering pages…</span>
              <span className="font-semibold text-primary">{progressPct}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <motion.div className="h-full bg-accent rounded-full" initial={{width:0}} animate={{width:`${progressPct}%`}} transition={{duration:0.3}}/>
            </div>
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3">
            <CheckCircle size={16} className="shrink-0"/>
            <span className="text-sm font-medium">Export complete — check your downloads</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3">
            <AlertCircle size={16} className="shrink-0"/>
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </Modal>
  )
}
