import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Planner, PlannerBlock, PlannerPage, PlannerType, PlannerConfig,
  PlannerFolder, PageSection, HistorySnapshot, PlannerStatus, BlockPreset
} from '@/types'
import { generateId } from '@/utils/id'
import { PLANNER_TYPE_PAGES, DEFAULT_CONFIG, PLANNER_TYPE_LABELS } from '@/lib/defaults'

const MAX_HISTORY = 10

interface PlannerState {
  planners: Planner[]
  folders: PlannerFolder[]
  blockPresets: BlockPreset[]
  activePlannerId: string | null
  activePageId: string | null
  selectedBlockId: string | null
  isDirty: boolean
  lastSaved: string | null

  // Planner CRUD
  createPlanner: (type: PlannerType, name?: string, folderId?: string) => Planner
  updatePlanner: (id: string, updates: Partial<Planner>) => void
  deletePlanner: (id: string) => void
  duplicatePlanner: (id: string) => Planner
  renamePlanner: (id: string, name: string) => void
  setStatus: (id: string, status: PlannerStatus) => void
  addTag: (id: string, tag: string) => void
  removeTag: (id: string, tag: string) => void
  moveToFolder: (id: string, folderId: string | null) => void

  // Navigation
  setActivePlanner: (id: string | null) => void
  setActivePage: (id: string | null) => void
  setSelectedBlock: (id: string | null) => void

  // History / Undo-Redo
  pushHistory: (plannerId: string, label: string) => void
  undo: (plannerId: string) => void
  redo: (plannerId: string) => void
  canUndo: (plannerId: string) => boolean
  canRedo: (plannerId: string) => boolean

  // Pages
  addPage: (plannerId: string, afterPageId?: string) => string
  deletePage: (plannerId: string, pageId: string) => void
  duplicatePage: (plannerId: string, pageId: string) => void
  reorderPages: (plannerId: string, fromIndex: number, toIndex: number) => void
  updatePage: (plannerId: string, pageId: string, updates: Partial<PlannerPage>) => void
  renamePage: (plannerId: string, pageId: string, title: string) => void

  // Sections
  addSection: (plannerId: string, name: string) => void
  removeSection: (plannerId: string, sectionId: string) => void
  assignPageToSection: (plannerId: string, pageId: string, sectionId: string | undefined) => void

  // Blocks
  addBlock: (plannerId: string, pageId: string, block: Omit<PlannerBlock, 'id'>) => string
  updateBlock: (plannerId: string, pageId: string, blockId: string, updates: Partial<PlannerBlock>) => void
  deleteBlock: (plannerId: string, pageId: string, blockId: string) => void
  reorderBlocks: (plannerId: string, pageId: string, fromIndex: number, toIndex: number) => void
  duplicateBlock: (plannerId: string, pageId: string, blockId: string) => void
  toggleBlockLock: (plannerId: string, pageId: string, blockId: string) => void
  toggleBlockHidden: (plannerId: string, pageId: string, blockId: string) => void

  // Config
  updateConfig: (plannerId: string, config: Partial<PlannerConfig>) => void

  // Folders
  createFolder: (name: string, color?: string) => PlannerFolder
  deleteFolder: (id: string) => void
  renameFolder: (id: string, name: string) => void

  // Block Presets
  saveBlockPreset: (name: string, block: PlannerBlock) => void
  deleteBlockPreset: (id: string) => void

  // Import / Export
  importPlanner: (data: Partial<Planner>) => Planner
  exportPlannerJson: (id: string) => string

  // Getters
  getActivePlanner: () => Planner | null
  getActivePage: () => PlannerPage | null
  getPlannerById: (id: string) => Planner | null
  getPlannersByFolder: (folderId: string | null) => Planner[]

  markSaved: () => void
}

// ── history helpers ────────────────────────────────────────────────────────────
interface HistoryState {
  past: HistorySnapshot[]
  future: HistorySnapshot[]
}
const historyMap = new Map<string, HistoryState>()

function getHistory(id: string): HistoryState {
  if (!historyMap.has(id)) historyMap.set(id, { past: [], future: [] })
  return historyMap.get(id)!
}

function snapshot(planner: Planner, label: string): HistorySnapshot {
  return {
    id: generateId('snap'),
    timestamp: new Date().toISOString(),
    label,
    pages: JSON.parse(JSON.stringify(planner.pages)),
    config: JSON.parse(JSON.stringify(planner.config)),
  }
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      planners: [],
      folders: [],
      blockPresets: [],
      activePlannerId: null,
      activePageId: null,
      selectedBlockId: null,
      isDirty: false,
      lastSaved: null,

      // ── Planner CRUD ──────────────────────────────────────────────────────
      createPlanner: (type, name, folderId) => {
        const pages = PLANNER_TYPE_PAGES[type]()
        const planner: Planner = {
          id: generateId('planner'),
          name: name || `My ${PLANNER_TYPE_LABELS[type] ?? type}`,
          description: '',
          type,
          status: 'draft',
          pages,
          sections: [],
          config: { ...DEFAULT_CONFIG },
          tags: [type],
          folderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          history: [],
        }
        set(s => ({
          planners: [...s.planners, planner],
          activePlannerId: planner.id,
          activePageId: pages[0]?.id ?? null,
          isDirty: false,
        }))
        return planner
      },

      updatePlanner: (id, updates) => {
        set(s => ({
          planners: s.planners.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
          isDirty: true,
        }))
      },

      deletePlanner: (id) => {
        historyMap.delete(id)
        set(s => ({
          planners: s.planners.filter(p => p.id !== id),
          activePlannerId: s.activePlannerId === id ? null : s.activePlannerId,
          activePageId: s.activePlannerId === id ? null : s.activePageId,
        }))
      },

      duplicatePlanner: (id) => {
        const original = get().planners.find(p => p.id === id)
        if (!original) throw new Error('Planner not found')
        const dup: Planner = {
          ...JSON.parse(JSON.stringify(original)),
          id: generateId('planner'),
          name: `${original.name} (Copy)`,
          status: 'draft',
          pages: original.pages.map(pg => ({
            ...pg, id: generateId('page'),
            blocks: pg.blocks.map(b => ({ ...b, id: generateId('block') })),
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: [],
          version: 1,
        }
        set(s => ({ planners: [...s.planners, dup] }))
        return dup
      },

      renamePlanner: (id, name) => {
        set(s => ({
          planners: s.planners.map(p =>
            p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
          ),
        }))
      },

      setStatus: (id, status) => {
        set(s => ({
          planners: s.planners.map(p => p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p),
        }))
      },

      addTag: (id, tag) => {
        set(s => ({
          planners: s.planners.map(p =>
            p.id === id && !p.tags.includes(tag)
              ? { ...p, tags: [...p.tags, tag] } : p
          ),
        }))
      },

      removeTag: (id, tag) => {
        set(s => ({
          planners: s.planners.map(p =>
            p.id === id ? { ...p, tags: p.tags.filter(t => t !== tag) } : p
          ),
        }))
      },

      moveToFolder: (id, folderId) => {
        set(s => ({
          planners: s.planners.map(p =>
            p.id === id ? { ...p, folderId: folderId ?? undefined } : p
          ),
        }))
      },

      // ── Navigation ───────────────────────────────────────────────────────
      setActivePlanner: (id) => {
        const planner = id ? get().planners.find(p => p.id === id) : null
        set({ activePlannerId: id, activePageId: planner?.pages[0]?.id ?? null, selectedBlockId: null })
      },
      setActivePage: (id) => set({ activePageId: id, selectedBlockId: null }),
      setSelectedBlock: (id) => set({ selectedBlockId: id }),

      // ── History / Undo-Redo ───────────────────────────────────────────────
      pushHistory: (plannerId, label) => {
        const planner = get().planners.find(p => p.id === plannerId)
        if (!planner) return
        const h = getHistory(plannerId)
        h.past = [...h.past.slice(-MAX_HISTORY), snapshot(planner, label)]
        h.future = []
      },

      undo: (plannerId) => {
        const h = getHistory(plannerId)
        const planner = get().planners.find(p => p.id === plannerId)
        if (!h.past.length || !planner) return
        const current = snapshot(planner, 'before undo')
        const prev = h.past[h.past.length - 1]
        h.future = [current, ...h.future.slice(0, MAX_HISTORY)]
        h.past = h.past.slice(0, -1)
        set(s => ({
          planners: s.planners.map(p =>
            p.id === plannerId
              ? { ...p, pages: prev.pages, config: prev.config, updatedAt: new Date().toISOString() }
              : p
          ),
        }))
      },

      redo: (plannerId) => {
        const h = getHistory(plannerId)
        const planner = get().planners.find(p => p.id === plannerId)
        if (!h.future.length || !planner) return
        const current = snapshot(planner, 'before redo')
        const next = h.future[0]
        h.past = [...h.past.slice(-MAX_HISTORY), current]
        h.future = h.future.slice(1)
        set(s => ({
          planners: s.planners.map(p =>
            p.id === plannerId
              ? { ...p, pages: next.pages, config: next.config, updatedAt: new Date().toISOString() }
              : p
          ),
        }))
      },

      canUndo: (plannerId) => (getHistory(plannerId).past.length > 0),
      canRedo: (plannerId) => (getHistory(plannerId).future.length > 0),

      // ── Pages ─────────────────────────────────────────────────────────────
      addPage: (plannerId, afterPageId) => {
        const pageId = generateId('page')
        set(s => ({
          planners: s.planners.map(p => {
            if (p.id !== plannerId) return p
            const afterIdx = afterPageId ? p.pages.findIndex(pg => pg.id === afterPageId) : p.pages.length - 1
            const newPage: PlannerPage = {
              id: pageId, title: `Page ${p.pages.length + 1}`, order: afterIdx + 1,
              blocks: [], pageSize: p.config.pageSize, orientation: p.config.orientation, margin: 24,
            }
            const pages = [...p.pages]
            pages.splice(afterIdx + 1, 0, newPage)
            return { ...p, pages: pages.map((pg, i) => ({ ...pg, order: i })), updatedAt: new Date().toISOString() }
          }),
          activePageId: pageId,
          isDirty: true,
        }))
        return pageId
      },

      deletePage: (plannerId, pageId) => {
        set(s => {
          const planner = s.planners.find(p => p.id === plannerId)
          if (!planner || planner.pages.length <= 1) return s
          const pages = planner.pages.filter(pg => pg.id !== pageId).map((pg, i) => ({ ...pg, order: i }))
          const newActiveId = s.activePageId === pageId ? pages[0]?.id ?? null : s.activePageId
          return {
            planners: s.planners.map(p => p.id === plannerId ? { ...p, pages, updatedAt: new Date().toISOString() } : p),
            activePageId: newActiveId,
            isDirty: true,
          }
        })
      },

      duplicatePage: (plannerId, pageId) => {
        const newId = generateId('page')
        set(s => ({
          planners: s.planners.map(p => {
            if (p.id !== plannerId) return p
            const orig = p.pages.find(pg => pg.id === pageId)
            if (!orig) return p
            const dup: PlannerPage = {
              ...JSON.parse(JSON.stringify(orig)),
              id: newId,
              title: `${orig.title} (Copy)`,
              order: p.pages.length,
              blocks: orig.blocks.map(b => ({ ...b, id: generateId('block') })),
            }
            return { ...p, pages: [...p.pages, dup], updatedAt: new Date().toISOString() }
          }),
          activePageId: newId,
          isDirty: true,
        }))
      },

      reorderPages: (plannerId, fromIndex, toIndex) => {
        set(s => ({
          planners: s.planners.map(p => {
            if (p.id !== plannerId) return p
            const pages = [...p.pages]
            const [removed] = pages.splice(fromIndex, 1)
            pages.splice(toIndex, 0, removed)
            return { ...p, pages: pages.map((pg, i) => ({ ...pg, order: i })), updatedAt: new Date().toISOString() }
          }),
          isDirty: true,
        }))
      },

      updatePage: (plannerId, pageId, updates) => {
        set(s => ({
          planners: s.planners.map(p => p.id !== plannerId ? p : {
            ...p,
            pages: p.pages.map(pg => pg.id === pageId ? { ...pg, ...updates } : pg),
            updatedAt: new Date().toISOString(),
          }),
          isDirty: true,
        }))
      },

      renamePage: (plannerId, pageId, title) => {
        get().updatePage(plannerId, pageId, { title })
      },

      // ── Sections ──────────────────────────────────────────────────────────
      addSection: (plannerId, name) => {
        const section: PageSection = { id: generateId('section'), name, pageIds: [], color: '#6366F1' }
        set(s => ({
          planners: s.planners.map(p =>
            p.id === plannerId ? { ...p, sections: [...p.sections, section] } : p
          ),
        }))
      },

      removeSection: (plannerId, sectionId) => {
        set(s => ({
          planners: s.planners.map(p => p.id !== plannerId ? p : {
            ...p,
            sections: p.sections.filter(sec => sec.id !== sectionId),
            pages: p.pages.map(pg => pg.sectionId === sectionId ? { ...pg, sectionId: undefined } : pg),
          }),
        }))
      },

      assignPageToSection: (plannerId, pageId, sectionId) => {
        get().updatePage(plannerId, pageId, { sectionId })
      },

      // ── Blocks ────────────────────────────────────────────────────────────
      addBlock: (plannerId, pageId, block) => {
        const id = generateId('block')
        const newBlock: PlannerBlock = { ...block, id }
        get().pushHistory(plannerId, `Add ${block.type}`)
        set(s => ({
          planners: s.planners.map(p => p.id !== plannerId ? p : {
            ...p,
            pages: p.pages.map(pg => pg.id !== pageId ? pg : {
              ...pg, blocks: [...pg.blocks, { ...newBlock, order: pg.blocks.length }],
            }),
            updatedAt: new Date().toISOString(),
          }),
          selectedBlockId: id,
          isDirty: true,
        }))
        return id
      },

      updateBlock: (plannerId, pageId, blockId, updates) => {
        set(s => ({
          planners: s.planners.map(p => p.id !== plannerId ? p : {
            ...p,
            pages: p.pages.map(pg => pg.id !== pageId ? pg : {
              ...pg, blocks: pg.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b),
            }),
            updatedAt: new Date().toISOString(),
          }),
          isDirty: true,
        }))
      },

      deleteBlock: (plannerId, pageId, blockId) => {
        get().pushHistory(plannerId, 'Delete block')
        set(s => ({
          planners: s.planners.map(p => p.id !== plannerId ? p : {
            ...p,
            pages: p.pages.map(pg => pg.id !== pageId ? pg : {
              ...pg, blocks: pg.blocks.filter(b => b.id !== blockId).map((b, i) => ({ ...b, order: i })),
            }),
            updatedAt: new Date().toISOString(),
          }),
          selectedBlockId: s.selectedBlockId === blockId ? null : s.selectedBlockId,
          isDirty: true,
        }))
      },

      reorderBlocks: (plannerId, pageId, fromIndex, toIndex) => {
        set(s => ({
          planners: s.planners.map(p => p.id !== plannerId ? p : {
            ...p,
            pages: p.pages.map(pg => {
              if (pg.id !== pageId) return pg
              const blocks = [...pg.blocks]
              const [removed] = blocks.splice(fromIndex, 1)
              blocks.splice(toIndex, 0, removed)
              return { ...pg, blocks: blocks.map((b, i) => ({ ...b, order: i })) }
            }),
            updatedAt: new Date().toISOString(),
          }),
          isDirty: true,
        }))
      },

      duplicateBlock: (plannerId, pageId, blockId) => {
        const newId = generateId('block')
        set(s => ({
          planners: s.planners.map(p => p.id !== plannerId ? p : {
            ...p,
            pages: p.pages.map(pg => {
              if (pg.id !== pageId) return pg
              const orig = pg.blocks.find(b => b.id === blockId)
              if (!orig) return pg
              const dup: PlannerBlock = { ...JSON.parse(JSON.stringify(orig)), id: newId, order: pg.blocks.length }
              return { ...pg, blocks: [...pg.blocks, dup] }
            }),
            updatedAt: new Date().toISOString(),
          }),
          selectedBlockId: newId,
          isDirty: true,
        }))
      },

      toggleBlockLock: (plannerId, pageId, blockId) => {
        const block = get().planners.find(p => p.id === plannerId)?.pages
          .find(pg => pg.id === pageId)?.blocks.find(b => b.id === blockId)
        if (block) get().updateBlock(plannerId, pageId, blockId, { locked: !block.locked })
      },

      toggleBlockHidden: (plannerId, pageId, blockId) => {
        const block = get().planners.find(p => p.id === plannerId)?.pages
          .find(pg => pg.id === pageId)?.blocks.find(b => b.id === blockId)
        if (block) get().updateBlock(plannerId, pageId, blockId, { hidden: !block.hidden })
      },

      // ── Config ────────────────────────────────────────────────────────────
      updateConfig: (plannerId, config) => {
        set(s => ({
          planners: s.planners.map(p => p.id !== plannerId ? p : {
            ...p, config: { ...p.config, ...config }, updatedAt: new Date().toISOString(),
          }),
          isDirty: true,
        }))
      },

      // ── Folders ───────────────────────────────────────────────────────────
      createFolder: (name, color = '#6366F1') => {
        const folder: PlannerFolder = {
          id: generateId('folder'), name, color, icon: 'folder', createdAt: new Date().toISOString(),
        }
        set(s => ({ folders: [...s.folders, folder] }))
        return folder
      },

      deleteFolder: (id) => {
        set(s => ({
          folders: s.folders.filter(f => f.id !== id),
          planners: s.planners.map(p => p.folderId === id ? { ...p, folderId: undefined } : p),
        }))
      },

      renameFolder: (id, name) => {
        set(s => ({ folders: s.folders.map(f => f.id === id ? { ...f, name } : f) }))
      },

      // ── Block Presets ─────────────────────────────────────────────────────
      saveBlockPreset: (name, block) => {
        const preset: BlockPreset = {
          id: generateId('preset'), name,
          blockType: block.type, config: { ...block.config },
          style: { ...block.style }, createdAt: new Date().toISOString(),
        }
        set(s => ({ blockPresets: [...s.blockPresets, preset] }))
      },

      deleteBlockPreset: (id) => {
        set(s => ({ blockPresets: s.blockPresets.filter(p => p.id !== id) }))
      },

      // ── Import / Export ───────────────────────────────────────────────────
      importPlanner: (data) => {
        const planner: Planner = {
          id: generateId('planner'),
          name: data.name || 'Imported Planner',
          description: data.description || '',
          type: data.type || 'daily',
          status: 'draft',
          pages: data.pages?.map(pg => ({
            ...pg, id: generateId('page'),
            blocks: pg.blocks?.map(b => ({ ...b, id: generateId('block') })) ?? [],
          })) ?? [],
          sections: [],
          config: data.config ? { ...DEFAULT_CONFIG, ...data.config } : { ...DEFAULT_CONFIG },
          tags: data.tags ?? [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          history: [],
        }
        set(s => ({ planners: [...s.planners, planner] }))
        return planner
      },

      exportPlannerJson: (id) => {
        const planner = get().planners.find(p => p.id === id)
        if (!planner) return ''
        const { history, ...exportData } = planner
        return JSON.stringify(exportData, null, 2)
      },

      // ── Getters ───────────────────────────────────────────────────────────
      getActivePlanner: () => {
        const { planners, activePlannerId } = get()
        return planners.find(p => p.id === activePlannerId) ?? null
      },
      getActivePage: () => {
        const { activePlannerId, activePageId, planners } = get()
        const planner = planners.find(p => p.id === activePlannerId)
        return planner?.pages.find(pg => pg.id === activePageId) ?? null
      },
      getPlannerById: (id) => get().planners.find(p => p.id === id) ?? null,
      getPlannersByFolder: (folderId) => {
        return get().planners.filter(p =>
          folderId === null ? !p.folderId : p.folderId === folderId
        )
      },

      markSaved: () => set({ isDirty: false, lastSaved: new Date().toISOString() }),
    }),
    {
      name: 'psp-planner-store-v2',
      partialize: (s) => ({
        planners: s.planners.map(p => ({ ...p, history: [] })),
        folders: s.folders,
        blockPresets: s.blockPresets,
      }),
    }
  )
)
