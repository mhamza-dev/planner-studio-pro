import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Planner, PlannerBlock, PlannerPage, PlannerType, PlannerConfig } from '@/types'
import { generateId } from '@/utils/id'
import { PLANNER_TYPE_PAGES, DEFAULT_CONFIG, PLANNER_TYPE_LABELS } from '@/lib/defaults'

interface PlannerState {
  planners: Planner[]
  activePlannerId: string | null
  activePageId: string | null
  selectedBlockId: string | null
  isDirty: boolean

  // Actions
  createPlanner: (type: PlannerType, name?: string) => Planner
  updatePlanner: (id: string, updates: Partial<Planner>) => void
  deletePlanner: (id: string) => void
  duplicatePlanner: (id: string) => Planner
  setActivePlanner: (id: string | null) => void
  setActivePage: (id: string | null) => void
  setSelectedBlock: (id: string | null) => void

  // Page actions
  addPage: (plannerId: string) => void
  deletePage: (plannerId: string, pageId: string) => void
  reorderPages: (plannerId: string, fromIndex: number, toIndex: number) => void
  updatePage: (plannerId: string, pageId: string, updates: Partial<PlannerPage>) => void

  // Block actions
  addBlock: (plannerId: string, pageId: string, block: Omit<PlannerBlock, 'id'>) => void
  updateBlock: (plannerId: string, pageId: string, blockId: string, updates: Partial<PlannerBlock>) => void
  deleteBlock: (plannerId: string, pageId: string, blockId: string) => void
  reorderBlocks: (plannerId: string, pageId: string, fromIndex: number, toIndex: number) => void
  duplicateBlock: (plannerId: string, pageId: string, blockId: string) => void

  // Config actions
  updateConfig: (plannerId: string, config: Partial<PlannerConfig>) => void

  getActivePlanner: () => Planner | null
  getActivePage: () => PlannerPage | null
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      planners: [],
      activePlannerId: null,
      activePageId: null,
      selectedBlockId: null,
      isDirty: false,

      createPlanner: (type, name) => {
        const pages = PLANNER_TYPE_PAGES[type]()
        const planner: Planner = {
          id: generateId('planner'),
          name: name || `My ${PLANNER_TYPE_LABELS[type]}`,
          type,
          description: '',
          pages,
          config: { ...DEFAULT_CONFIG },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [type],
        }
        set(state => ({
          planners: [...state.planners, planner],
          activePlannerId: planner.id,
          activePageId: pages[0]?.id ?? null,
          isDirty: false,
        }))
        return planner
      },

      updatePlanner: (id, updates) => {
        set(state => ({
          planners: state.planners.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
          isDirty: true,
        }))
      },

      deletePlanner: (id) => {
        set(state => ({
          planners: state.planners.filter(p => p.id !== id),
          activePlannerId: state.activePlannerId === id ? null : state.activePlannerId,
          activePageId: state.activePlannerId === id ? null : state.activePageId,
        }))
      },

      duplicatePlanner: (id) => {
        const original = get().planners.find(p => p.id === id)
        if (!original) throw new Error('Planner not found')
        const duplicate: Planner = {
          ...original,
          id: generateId('planner'),
          name: `${original.name} (Copy)`,
          pages: original.pages.map(page => ({
            ...page,
            id: generateId('page'),
            blocks: page.blocks.map(block => ({ ...block, id: generateId('block') })),
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(state => ({ planners: [...state.planners, duplicate] }))
        return duplicate
      },

      setActivePlanner: (id) => {
        const planner = id ? get().planners.find(p => p.id === id) : null
        set({
          activePlannerId: id,
          activePageId: planner?.pages[0]?.id ?? null,
          selectedBlockId: null,
        })
      },

      setActivePage: (id) => set({ activePageId: id, selectedBlockId: null }),
      setSelectedBlock: (id) => set({ selectedBlockId: id }),

      addPage: (plannerId) => {
        const pageId = generateId('page')
        const newPage: PlannerPage = {
          id: pageId,
          title: 'New Page',
          order: 0,
          blocks: [],
          pageSize: 'A4',
          orientation: 'portrait',
          margin: 24,
        }
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            const pages = [...p.pages, { ...newPage, order: p.pages.length }]
            return { ...p, pages, updatedAt: new Date().toISOString() }
          }),
          activePageId: pageId,
          isDirty: true,
        }))
      },

      deletePage: (plannerId, pageId) => {
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            const pages = p.pages.filter(pg => pg.id !== pageId)
              .map((pg, i) => ({ ...pg, order: i }))
            return { ...p, pages, updatedAt: new Date().toISOString() }
          }),
          activePageId: state.activePageId === pageId
            ? state.planners.find(p => p.id === plannerId)?.pages.find(pg => pg.id !== pageId)?.id ?? null
            : state.activePageId,
          isDirty: true,
        }))
      },

      reorderPages: (plannerId, fromIndex, toIndex) => {
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            const pages = [...p.pages]
            const [removed] = pages.splice(fromIndex, 1)
            pages.splice(toIndex, 0, removed)
            return {
              ...p,
              pages: pages.map((pg, i) => ({ ...pg, order: i })),
              updatedAt: new Date().toISOString(),
            }
          }),
          isDirty: true,
        }))
      },

      updatePage: (plannerId, pageId, updates) => {
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            return {
              ...p,
              pages: p.pages.map(pg => pg.id === pageId ? { ...pg, ...updates } : pg),
              updatedAt: new Date().toISOString(),
            }
          }),
          isDirty: true,
        }))
      },

      addBlock: (plannerId, pageId, block) => {
        const newBlock: PlannerBlock = { ...block, id: generateId('block') }
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            return {
              ...p,
              pages: p.pages.map(pg => {
                if (pg.id !== pageId) return pg
                return {
                  ...pg,
                  blocks: [...pg.blocks, { ...newBlock, order: pg.blocks.length }],
                }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
          selectedBlockId: newBlock.id,
          isDirty: true,
        }))
      },

      updateBlock: (plannerId, pageId, blockId, updates) => {
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            return {
              ...p,
              pages: p.pages.map(pg => {
                if (pg.id !== pageId) return pg
                return {
                  ...pg,
                  blocks: pg.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b),
                }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
          isDirty: true,
        }))
      },

      deleteBlock: (plannerId, pageId, blockId) => {
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            return {
              ...p,
              pages: p.pages.map(pg => {
                if (pg.id !== pageId) return pg
                return {
                  ...pg,
                  blocks: pg.blocks.filter(b => b.id !== blockId)
                    .map((b, i) => ({ ...b, order: i })),
                }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
          selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
          isDirty: true,
        }))
      },

      reorderBlocks: (plannerId, pageId, fromIndex, toIndex) => {
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            return {
              ...p,
              pages: p.pages.map(pg => {
                if (pg.id !== pageId) return pg
                const blocks = [...pg.blocks]
                const [removed] = blocks.splice(fromIndex, 1)
                blocks.splice(toIndex, 0, removed)
                return { ...pg, blocks: blocks.map((b, i) => ({ ...b, order: i })) }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
          isDirty: true,
        }))
      },

      duplicateBlock: (plannerId, pageId, blockId) => {
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            return {
              ...p,
              pages: p.pages.map(pg => {
                if (pg.id !== pageId) return pg
                const original = pg.blocks.find(b => b.id === blockId)
                if (!original) return pg
                const duplicate = { ...original, id: generateId('block'), order: pg.blocks.length }
                return { ...pg, blocks: [...pg.blocks, duplicate] }
              }),
              updatedAt: new Date().toISOString(),
            }
          }),
          isDirty: true,
        }))
      },

      updateConfig: (plannerId, config) => {
        set(state => ({
          planners: state.planners.map(p => {
            if (p.id !== plannerId) return p
            return { ...p, config: { ...p.config, ...config }, updatedAt: new Date().toISOString() }
          }),
          isDirty: true,
        }))
      },

      getActivePlanner: () => {
        const { planners, activePlannerId } = get()
        return planners.find(p => p.id === activePlannerId) ?? null
      },

      getActivePage: () => {
        const { activePlannerId, activePageId, planners } = get()
        const planner = planners.find(p => p.id === activePlannerId)
        return planner?.pages.find(pg => pg.id === activePageId) ?? null
      },
    }),
    {
      name: 'planner-store',
      partialize: (state) => ({ planners: state.planners }),
    }
  )
)
