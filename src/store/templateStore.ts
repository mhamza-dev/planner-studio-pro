import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TEMPLATES } from '@/lib/templates'
import type { Template } from '@/types'

interface TemplateState {
  templates: Template[]
  favorites: string[]
  searchQuery: string
  selectedCategory: string
  activeThemeId: string
  toggleFavorite: (id: string) => void
  setSearchQuery: (q: string) => void
  setSelectedCategory: (cat: string) => void
  setActiveThemeId: (id: string) => void
  getFiltered: () => Template[]
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: TEMPLATES,
      favorites: [],
      searchQuery: '',
      selectedCategory: 'All',
      activeThemeId: 'minimalist',
      toggleFavorite: (id) => {
        set(s => {
          const favs = s.favorites.includes(id)
            ? s.favorites.filter(f => f !== id)
            : [...s.favorites, id]
          return {
            favorites: favs,
            templates: s.templates.map(t => ({ ...t, isFavorite: favs.includes(t.id) })),
          }
        })
      },
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setActiveThemeId: (id) => set({ activeThemeId: id }),
      getFiltered: () => {
        const { templates, searchQuery, selectedCategory } = get()
        return templates.filter(t => {
          const matchCat = selectedCategory === 'All' || t.category === selectedCategory
          const q = searchQuery.toLowerCase()
          const matchSearch = !q || t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some(tag => tag.toLowerCase().includes(q))
          return matchCat && matchSearch
        })
      },
    }),
    { name: 'psp-templates-v3', partialize: s => ({ favorites: s.favorites, activeThemeId: s.activeThemeId }) }
  )
)
