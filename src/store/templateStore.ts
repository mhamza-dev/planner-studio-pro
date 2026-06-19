import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TEMPLATES } from '@/lib/templates'
import type { Template } from '@/types'

interface TemplateState {
  templates: Template[]
  favorites: string[]
  searchQuery: string
  selectedCategory: string

  toggleFavorite: (id: string) => void
  setSearchQuery: (q: string) => void
  setSelectedCategory: (cat: string) => void
  getFilteredTemplates: () => Template[]
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: TEMPLATES,
      favorites: [],
      searchQuery: '',
      selectedCategory: 'All',

      toggleFavorite: (id) => {
        set(state => {
          const favorites = state.favorites.includes(id)
            ? state.favorites.filter(f => f !== id)
            : [...state.favorites, id]
          return {
            favorites,
            templates: state.templates.map(t => ({
              ...t,
              isFavorite: favorites.includes(t.id),
            })),
          }
        })
      },

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),

      getFilteredTemplates: () => {
        const { templates, searchQuery, selectedCategory } = get()
        return templates.filter(t => {
          const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
          const matchesSearch = !searchQuery ||
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          return matchesCategory && matchesSearch
        })
      },
    }),
    {
      name: 'template-store',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
)
