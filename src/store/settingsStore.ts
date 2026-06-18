import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '@/types'

interface SettingsState {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
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
      },
      updateSettings: (updates) =>
        set(s => ({ settings: { ...s.settings, ...updates } })),
    }),
    { name: 'settings-store' }
  )
)
