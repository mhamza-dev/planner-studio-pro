import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, Sparkles, Download, Flame, TrendingUp, Star } from 'lucide-react'
import { TopBar } from '@/components/layout/index'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/index'
import { EmptyState } from '@/components/ui/index'
import { useTemplateStore } from '@/store/templateStore'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { TEMPLATE_CATEGORIES } from '@/lib/templates'
import { THEMES, THEME_LIST } from '@/themes'
import type { Template } from '@/types'
import { cn } from '@/utils/cn'

function TemplateCard({ template, onUse, onToggleFav, activeThemeId }: {
  template: Template; onUse: () => void; onToggleFav: () => void; activeThemeId: string
}) {
  const [hovered, setHovered] = React.useState(false)
  // Use the active global theme for preview, fall back to template's native theme
  const theme = THEMES[activeThemeId] || THEMES[template.themeId || 'minimalist'] || THEMES.minimalist
  const c = theme.colors

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      className="group relative rounded-2xl overflow-hidden border border-white/70 bg-white shadow-xs hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: theme.gradient }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 30%, ${c.accent}25, transparent 55%)` }} />

        {/* Paper preview */}
        <div className="relative transition-transform duration-300"
          style={{ transform: hovered ? 'rotate(0deg) scale(1.04)' : 'rotate(-2.5deg)', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.14))' }}>
          <div className="w-[88px] h-[112px] rounded-lg border flex flex-col overflow-hidden"
            style={{ backgroundColor: c.background, borderColor: c.border }}>
            {/* Top accent bar */}
            <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.secondary})` }} />
            <div className="flex-1 p-2 flex flex-col gap-1.5">
              <div className="h-[7px] w-[55%] rounded-sm" style={{ backgroundColor: c.primary }} />
              {[75, 55, 65, 45, 60].map((w, i) => (
                <div key={i} className="rounded-sm" style={{ height: 2, width: `${w}%`, backgroundColor: c.border }} />
              ))}
              <div className="mt-1 grid grid-cols-3 gap-1">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-[9px] rounded-sm" style={{ backgroundColor: i < 2 ? `${c.accent}50` : `${c.border}80` }} />
                ))}
              </div>
              <div className="mt-auto flex gap-0.5">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="flex-1 h-[14px] rounded-sm" style={{ backgroundColor: i <= 3 ? `${c.accent}40` : c.border }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center gap-2 transition-all duration-200',
          hovered ? 'opacity-100' : 'opacity-0'
        )} style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)' }}>
          <Button size="sm" onClick={onUse} className="shadow-float text-xs px-3 py-1.5">
            Use Template
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {template.isPremium && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white' }}>
              <Sparkles size={8} /> Pro
            </span>
          )}
          {template.isBestseller && !template.isPremium && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs bg-emerald-500 text-white">
              <Star size={8} fill="currentColor" /> Best
            </span>
          )}
        </div>

        {template.downloads > 5000 && (
          <span className="absolute top-2.5 right-10 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/90 text-white shadow-xs">
            <Flame size={8} /> Hot
          </span>
        )}
        {template.isTrending && !template.downloads && (
          <span className="absolute top-2.5 right-10 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/90 text-white shadow-xs">
            <TrendingUp size={8} /> Trending
          </span>
        )}

        {/* Fav button */}
        <button onClick={e => { e.stopPropagation(); onToggleFav() }}
          className={cn(
            'absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs',
            template.isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-ink-muted hover:text-red-500 opacity-0 group-hover:opacity-100'
          )}>
          <Heart size={12} fill={template.isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Theme pill */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-semibold"
          style={{ backgroundColor: `${c.accent}30`, color: c.primary, border: `1px solid ${c.border}` }}>
          {theme.emoji} {theme.name}
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-primary leading-snug">{template.name}</h3>
          <Badge variant="secondary" size="xs" className="shrink-0 mt-0.5">{template.category}</Badge>
        </div>
        <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2 mb-2.5">{template.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-ink-faint flex items-center gap-1">
            <Download size={9} />{template.downloads.toLocaleString()}
          </span>
          <div className="flex gap-1">
            {template.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] bg-surface-raised text-ink-faint px-1.5 py-0.5 rounded border border-border shadow-xs">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { getFiltered, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, toggleFavorite, activeThemeId, setActiveThemeId } = useTemplateStore()
  const { importPlanner, setActivePlanner } = usePlannerStore()
  const { toast } = useUIStore()
  const { trackTemplateUsed } = useAnalyticsStore()
  const [favOnly, setFavOnly] = React.useState(false)
  const [showThemePicker, setShowThemePicker] = React.useState(false)

  let templates = getFiltered()
  if (favOnly) templates = templates.filter(t => t.isFavorite)

  const handleUse = (tpl: Template) => {
    const p = importPlanner({
      name: tpl.name,
      description: tpl.description,
      type: tpl.type,
      pages: tpl.pages,
      config: { ...tpl.config, themeId: activeThemeId },
      tags: tpl.tags,
    })
    setActivePlanner(p.id)
    trackTemplateUsed()
    toast(`Started from "${tpl.name}"`, 'success')
    navigate('/builder')
  }

  const activeTheme = THEMES[activeThemeId] || THEMES.minimalist

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Templates" subtitle={`${templates.length} premium layouts · preview in any theme`}
        actions={
          <div className="flex items-center gap-2">
            {/* Theme preview pill */}
            <button onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/80 bg-white shadow-xs text-xs font-semibold text-primary hover:shadow-card transition-all">
              <span>{activeTheme.emoji}</span>
              <span>{activeTheme.name}</span>
              <span className="text-ink-faint">▾</span>
            </button>
            <Button variant={favOnly ? 'secondary' : 'outline'} size="sm" onClick={() => setFavOnly(!favOnly)}>
              <Heart size={13} fill={favOnly ? 'currentColor' : 'none'} /> Favorites
            </Button>
          </div>
        }
      />

      {/* Theme picker dropdown */}
      <AnimatePresence>
        {showThemePicker && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="px-6 py-4 bg-white/95 border-b border-white/70 backdrop-blur-xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint mb-3">Preview templates in a theme</p>
            <div className="flex flex-wrap gap-2">
              {THEME_LIST.map(theme => (
                <button key={theme.id} onClick={() => { setActiveThemeId(theme.id); setShowThemePicker(false) }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                    activeThemeId === theme.id
                      ? 'border-primary bg-primary text-white shadow-card'
                      : 'border-border bg-white text-ink-muted hover:border-border-strong hover:text-primary'
                  )}>
                  <span>{theme.emoji}</span>
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-auto">
        {/* Sticky filters */}
        <div className="sticky top-0 z-10 bg-white/80 border-b border-white/70 px-6 py-3 space-y-3 backdrop-blur-xl toolbar-shadow">
          <div className="relative max-w-sm">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
            <input type="search" placeholder="Search templates…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 text-xs rounded-lg border border-white/80 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 shadow-xs" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow-card'
                    : 'border-white/80 text-ink-muted hover:border-border-strong hover:text-primary bg-white/80 shadow-xs'
                )}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {templates.length === 0 ? (
            <EmptyState icon={<Search size={28} />}
              title={favOnly ? 'No favorites yet' : 'No templates match your search'}
              description={favOnly ? 'Heart any template to save it here.' : 'Try a different term or category.'}
              action={
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setFavOnly(false) }}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {templates.map(tpl => (
                  <TemplateCard key={tpl.id} template={tpl} activeThemeId={activeThemeId}
                    onUse={() => handleUse(tpl)} onToggleFav={() => toggleFavorite(tpl.id)} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
