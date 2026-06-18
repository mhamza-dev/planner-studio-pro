import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, SlidersHorizontal } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Misc'
import { TemplateCard } from '@/features/templates/TemplateCard'
import { useTemplateStore } from '@/store/templateStore'
import { usePlannerStore } from '@/store/plannerStore'
import { TEMPLATE_CATEGORIES } from '@/lib/templates'
import type { Template } from '@/types'
import { cn } from '@/utils/cn'

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { getFilteredTemplates, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, toggleFavorite } = useTemplateStore()
  const { createPlanner, setActivePlanner } = usePlannerStore()
  const [showFavOnly, setShowFavOnly] = React.useState(false)

  let templates = getFilteredTemplates()
  if (showFavOnly) templates = templates.filter(t => t.isFavorite)

  const handleUseTemplate = (template: Template) => {
    const planner = createPlanner(template.type, template.name)
    navigate('/builder')
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Templates"
        subtitle={`${templates.length} ready-to-use planner layouts`}
        actions={
          <Button
            variant={showFavOnly ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowFavOnly(!showFavOnly)}
          >
            <Heart size={14} fill={showFavOnly ? 'currentColor' : 'none'} />
            Favorites
          </Button>
        }
      />

      <div className="flex-1 overflow-auto">
        {/* Filters */}
        <div className="sticky top-0 z-10 bg-paper border-b border-border px-6 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150',
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-secondary hover:border-accent-dark hover:text-primary bg-paper'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="p-6">
          {templates.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title={showFavOnly ? 'No favorites yet' : 'No templates match your search'}
              description={
                showFavOnly
                  ? 'Heart any template to save it here for quick access.'
                  : 'Try a different search term or category.'
              }
              action={
                showFavOnly ? (
                  <Button variant="outline" size="sm" onClick={() => setShowFavOnly(false)}>
                    Browse all templates
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}>
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {templates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleUseTemplate}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
