import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Toast, AppSettings } from '@/types'
import { generateId } from '@/utils/id'

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  toggleSidebar: () => void
  setMobileMenu: (open: boolean) => void

  // Builder canvas
  previewZoom: number
  showGrid: boolean
  showRulers: boolean
  showMiniMap: boolean
  focusMode: boolean
  spreadView: boolean
  setPreviewZoom: (z: number) => void
  setShowGrid: (v: boolean) => void
  setShowRulers: (v: boolean) => void
  setShowMiniMap: (v: boolean) => void
  toggleFocusMode: () => void
  setSpreadView: (v: boolean) => void

  // Panels
  exportModalOpen: boolean
  createModalOpen: boolean
  shortcutsModalOpen: boolean
  whatsNewModalOpen: boolean
  commandPaletteOpen: boolean
  onboardingOpen: boolean
  activeTab: string
  setExportModalOpen: (v: boolean) => void
  setCreateModalOpen: (v: boolean) => void
  setShortcutsModalOpen: (v: boolean) => void
  setCommandPaletteOpen: (v: boolean) => void
  setOnboardingOpen: (v: boolean) => void
  setActiveTab: (tab: string) => void

  // Dashboard
  dashboardView: 'grid' | 'list'
  dashboardSort: 'updatedAt' | 'createdAt' | 'name' | 'type'
  dashboardFilter: string
  dashboardSearch: string
  activeFolderId: string | null
  setDashboardView: (v: 'grid' | 'list') => void
  setDashboardSort: (v: 'updatedAt' | 'createdAt' | 'name' | 'type') => void
  setDashboardFilter: (v: string) => void
  setDashboardSearch: (v: string) => void
  setActiveFolderId: (id: string | null) => void

  // Toast
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  toast: (title: string, type?: Toast['type'], message?: string) => void

  // Theme
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark' | 'system') => void

  // Onboarding
  onboardingCompleted: boolean
  onboardingStep: number
  completeOnboarding: () => void
  setOnboardingStep: (step: number) => void

  // App version
  appVersion: string
  lastSeenVersion: string
  setLastSeenVersion: (v: string) => void
}

const APP_VERSION = '1.0.0'

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileMenu: (open) => set({ mobileMenuOpen: open }),

      // Canvas
      previewZoom: 85,
      showGrid: false,
      showRulers: false,
      showMiniMap: false,
      focusMode: false,
      spreadView: false,
      setPreviewZoom: (z) => set({ previewZoom: Math.min(200, Math.max(25, z)) }),
      setShowGrid: (v) => set({ showGrid: v }),
      setShowRulers: (v) => set({ showRulers: v }),
      setShowMiniMap: (v) => set({ showMiniMap: v }),
      toggleFocusMode: () => set(s => ({ focusMode: !s.focusMode })),
      setSpreadView: (v) => set({ spreadView: v }),

      // Panels
      exportModalOpen: false,
      createModalOpen: false,
      shortcutsModalOpen: false,
      whatsNewModalOpen: false,
      commandPaletteOpen: false,
      onboardingOpen: false,
      activeTab: 'blocks',
      setExportModalOpen: (v) => set({ exportModalOpen: v }),
      setCreateModalOpen: (v) => set({ createModalOpen: v }),
      setShortcutsModalOpen: (v) => set({ shortcutsModalOpen: v }),
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      setOnboardingOpen: (v) => set({ onboardingOpen: v }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Dashboard
      dashboardView: 'grid',
      dashboardSort: 'updatedAt',
      dashboardFilter: 'all',
      dashboardSearch: '',
      activeFolderId: null,
      setDashboardView: (v) => set({ dashboardView: v }),
      setDashboardSort: (v) => set({ dashboardSort: v }),
      setDashboardFilter: (v) => set({ dashboardFilter: v }),
      setDashboardSearch: (v) => set({ dashboardSearch: v }),
      setActiveFolderId: (id) => set({ activeFolderId: id }),

      // Toast
      toasts: [],
      addToast: (toast) => {
        const id = generateId('toast')
        const newToast = { ...toast, id }
        set(s => ({ toasts: [...s.toasts, newToast] }))
        setTimeout(() => get().removeToast(id), toast.duration ?? 3500)
      },
      removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
      toast: (title, type = 'success', message) => {
        get().addToast({ title, type, message })
      },

      // Theme
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: (t) => {
        const resolved = t === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : t
        set({ theme: t, resolvedTheme: resolved })
        document.documentElement.classList.toggle('dark', resolved === 'dark')
      },

      // Onboarding
      onboardingCompleted: false,
      onboardingStep: 0,
      completeOnboarding: () => set({ onboardingCompleted: true, onboardingOpen: false }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      // Version
      appVersion: APP_VERSION,
      lastSeenVersion: '',
      setLastSeenVersion: (v) => set({ lastSeenVersion: v }),
    }),
    {
      name: 'psp-ui-store-v2',
      partialize: (s) => ({
        sidebarCollapsed: s.sidebarCollapsed,
        previewZoom: s.previewZoom,
        showGrid: s.showGrid,
        showRulers: s.showRulers,
        dashboardView: s.dashboardView,
        dashboardSort: s.dashboardSort,
        theme: s.theme,
        resolvedTheme: s.resolvedTheme,
        onboardingCompleted: s.onboardingCompleted,
        lastSeenVersion: s.lastSeenVersion,
      }),
    }
  )
)
