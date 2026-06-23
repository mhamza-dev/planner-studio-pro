import { create } from 'zustand'
import type { ExportConfig, DownloadRecord } from '@/types'

interface ExportState {
  config: ExportConfig
  downloads: DownloadRecord[]
  setConfig: (c: Partial<ExportConfig>) => void
  addDownload: (d: DownloadRecord) => void
  deleteDownload: (id: string) => void
}

export const useExportStore = create<ExportState>()((set) => ({
  config: { format: 'pdf', pageSize: 'A4', quality: 95, includeBleed: false, colorProfile: 'rgb', resolution: 300, scope: 'all' },
  downloads: [],
  setConfig: (c) => set(s => ({ config: { ...s.config, ...c } })),
  addDownload: (d) => set(s => ({ downloads: [d, ...s.downloads].slice(0, 50) })),
  deleteDownload: (id) => set(s => ({ downloads: s.downloads.filter(d => d.id !== id) })),
}))
