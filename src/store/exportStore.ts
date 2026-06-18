import { create } from 'zustand'
import type { ExportConfig, DownloadRecord, ExportFormat } from '@/types'

interface ExportState {
  config: ExportConfig
  downloads: DownloadRecord[]
  isExporting: boolean
  exportProgress: number
  exportError: string | null

  setConfig: (config: Partial<ExportConfig>) => void
  addDownload: (record: DownloadRecord) => void
  deleteDownload: (id: string) => void
  setIsExporting: (v: boolean) => void
  setExportProgress: (v: number) => void
  setExportError: (e: string | null) => void
}

export const useExportStore = create<ExportState>()((set) => ({
  config: {
    format: 'pdf' as ExportFormat,
    pageSize: 'A4',
    quality: 95,
    includeBleed: false,
    colorProfile: 'rgb',
    resolution: 300,
  },
  downloads: [],
  isExporting: false,
  exportProgress: 0,
  exportError: null,

  setConfig: (config) => set(s => ({ config: { ...s.config, ...config } })),
  addDownload: (record) => set(s => ({ downloads: [record, ...s.downloads] })),
  deleteDownload: (id) => set(s => ({ downloads: s.downloads.filter(d => d.id !== id) })),
  setIsExporting: (v) => set({ isExporting: v, exportProgress: v ? 0 : 100 }),
  setExportProgress: (v) => set({ exportProgress: v }),
  setExportError: (e) => set({ exportError: e }),
}))
