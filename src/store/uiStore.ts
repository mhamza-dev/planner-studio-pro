import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  previewZoom: number
  previewMode: 'single' | 'spread' | 'fit'
  showRulers: boolean
  showGrid: boolean
  exportModalOpen: boolean
  createModalOpen: boolean
  activeTab: string

  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setPreviewZoom: (zoom: number) => void
  setPreviewMode: (mode: 'single' | 'spread' | 'fit') => void
  setShowRulers: (show: boolean) => void
  setShowGrid: (show: boolean) => void
  setExportModalOpen: (open: boolean) => void
  setCreateModalOpen: (open: boolean) => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      previewZoom: 100,
      previewMode: 'fit',
      showRulers: false,
      showGrid: false,
      exportModalOpen: false,
      createModalOpen: false,
      activeTab: 'blocks',

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setPreviewZoom: (zoom) => set({ previewZoom: Math.min(200, Math.max(25, zoom)) }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setShowRulers: (show) => set({ showRulers: show }),
      setShowGrid: (show) => set({ showGrid: show }),
      setExportModalOpen: (open) => set({ exportModalOpen: open }),
      setCreateModalOpen: (open) => set({ createModalOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        showRulers: state.showRulers,
        showGrid: state.showGrid,
        previewZoom: state.previewZoom,
      }),
    }
  )
)
