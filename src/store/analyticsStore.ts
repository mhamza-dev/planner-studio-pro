import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UsageStats, BlockType } from '@/types'

interface AnalyticsState {
  stats: UsageStats
  blockUsage: Record<string, number>
  dailyExports: { date: string; count: number }[]
  trackPlannerCreated: () => void
  trackBlockAdded: (type: BlockType) => void
  trackExport: () => void
  trackTemplateUsed: () => void
  trackPageCreated: () => void
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      stats: {
        plannersCreated: 0,
        blocksAdded: 0,
        exportsCompleted: 0,
        templatesUsed: 0,
        favoriteBlockType: null,
        totalPagesCreated: 0,
        lastActive: new Date().toISOString(),
      },
      blockUsage: {},
      dailyExports: [],

      trackPlannerCreated: () => {
        set(s => ({ stats: { ...s.stats, plannersCreated: s.stats.plannersCreated + 1, lastActive: new Date().toISOString() } }))
      },

      trackBlockAdded: (type) => {
        set(s => {
          const usage = { ...s.blockUsage, [type]: (s.blockUsage[type] ?? 0) + 1 }
          const favoriteBlockType = Object.entries(usage).sort((a, b) => b[1] - a[1])[0]?.[0] as BlockType | null
          return {
            blockUsage: usage,
            stats: { ...s.stats, blocksAdded: s.stats.blocksAdded + 1, favoriteBlockType, lastActive: new Date().toISOString() },
          }
        })
      },

      trackExport: () => {
        const today = new Date().toISOString().split('T')[0]
        set(s => {
          const daily = [...s.dailyExports]
          const existing = daily.find(d => d.date === today)
          if (existing) existing.count++
          else daily.push({ date: today, count: 1 })
          return {
            dailyExports: daily.slice(-30),
            stats: { ...s.stats, exportsCompleted: s.stats.exportsCompleted + 1, lastActive: new Date().toISOString() },
          }
        })
      },

      trackTemplateUsed: () => {
        set(s => ({ stats: { ...s.stats, templatesUsed: s.stats.templatesUsed + 1, lastActive: new Date().toISOString() } }))
      },

      trackPageCreated: () => {
        set(s => ({ stats: { ...s.stats, totalPagesCreated: s.stats.totalPagesCreated + 1, lastActive: new Date().toISOString() } }))
      },
    }),
    { name: 'psp-analytics-v2' }
  )
)
