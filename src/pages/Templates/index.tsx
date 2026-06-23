import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, Sparkles, Download, ArrowRight } from 'lucide-react'
import { TopBar } from '@/components/layout/index'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/index'
import { EmptyState } from '@/components/ui/index'
import { useTemplateStore } from '@/store/templateStore'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { TEMPLATE_CATEGORIES } from '@/lib/templates'
import { PLANNER_TYPE_LABELS } from '@/lib/defaults'
import type { Template, PlannerType } from '@/types'
import { cn } from '@/utils/cn'

const HUE_BG: Record<string,string> = {
  tpl_daily_minimal: 'from-slate-50 to-slate-100',
  tpl_daily_sage: 'from-green-50 to-green-100',
  tpl_daily_executive: 'from-blue-50 to-blue-100',
  tpl_daily_rose: 'from-pink-50 to-rose-100',
  tpl_daily_ink: 'from-zinc-100 to-zinc-200',
  tpl_weekly_classic: 'from-slate-50 to-blue-50',
  tpl_weekly_blush: 'from-pink-50 to-rose-50',
  tpl_weekly_indigo: 'from-indigo-50 to-violet-100',
  tpl_monthly_classic: 'from-sky-50 to-blue-100',
  tpl_monthly_gold: 'from-amber-50 to-yellow-100',
  tpl_habit_grid: 'from-purple-50 to-violet-100',
  tpl_habit_sage: 'from-green-50 to-teal-100',
  tpl_budget_master: 'from-green-50 to-emerald-100',
  tpl_budget_minimalist: 'from-slate-50 to-gray-100',
  tpl_wellness_daily: 'from-pink-50 to-rose-100',
  tpl_wellness_teal: 'from-teal-50 to-cyan-100',
  tpl_fitness_log: 'from-zinc-100 to-stone-200',
  tpl_fitness_running: 'from-orange-50 to-red-100',
  tpl_student_success: 'from-orange-50 to-amber-100',
  tpl_student_exam: 'from-indigo-50 to-purple-100',
  tpl_student_semester: 'from-teal-50 to-cyan-100',
  tpl_business_pro: 'from-slate-50 to-gray-100',
  tpl_business_startup: 'from-violet-50 to-purple-100',
  tpl_business_freelance: 'from-amber-50 to-yellow-100',
  tpl_journal_morning: 'from-amber-50 to-orange-100',
  tpl_journal_gratitude: 'from-pink-50 to-rose-100',
  tpl_journal_5year: 'from-purple-50 to-indigo-100',
  tpl_creative_content: 'from-violet-50 to-purple-100',
  tpl_creative_design: 'from-teal-50 to-cyan-100',
  tpl_creative_story: 'from-amber-50 to-orange-100',
  tpl_life_yearreview: 'from-slate-50 to-blue-50',
  tpl_life_quarter: 'from-green-50 to-emerald-100',
  tpl_life_travel: 'from-sky-50 to-blue-100',
}

function TemplateCard({ template, onUse, onToggleFav }: {
  template: Template; onUse: () => void; onToggleFav: () => void
}) {
  const bg = HUE_BG[template.id] ?? 'from-gray-50 to-gray-100'

  return (
    <motion.div layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.97}}
      className="group glass-panel rounded-xl overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
      {/* Thumbnail */}
      <div className={cn('relative h-40 flex items-center justify-center bg-gradient-to-br', bg)}>
        <div className="absolute inset-x-8 top-6 h-16 rounded-full bg-white/60 blur-2xl"/>
        {/* Paper preview */}
        <div className="relative w-20 h-24 bg-white rounded-lg shadow-paper border border-white/90 p-2 flex flex-col gap-1 rotate-[-2deg] group-hover:rotate-0 transition-transform">
          <div className="h-1.5 w-10 rounded-full bg-primary/20"/>
          {[70,90,60,80,50,70].map((w,i) => (
            <div key={i} className="h-0.5 rounded-full bg-ink-faint/40" style={{width:`${w}%`}}/>
          ))}
          <div className="mt-1 grid grid-cols-3 gap-1">
            {[0,1,2,3,4,5].map(i=><div key={i} className="h-2 rounded bg-blue-100"/>)}
          </div>
        </div>

        {/* Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 backdrop-blur-[2px]">
          <Button size="sm" onClick={onUse} className="shadow-float">Use Template</Button>
        </div>

        {/* Badges */}
        {template.isPremium && (
          <div className="absolute top-2 left-2">
            <Badge variant="premium" size="xs"><Sparkles size={9}/> Pro</Badge>
          </div>
        )}

        {/* Favorite */}
        <button onClick={e=>{e.stopPropagation();onToggleFav()}}
          className={cn(
            'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs',
            'opacity-0 group-hover:opacity-100',
            template.isFavorite ? 'bg-red-500 text-white opacity-100' : 'bg-paper/90 text-ink-muted hover:text-red-500'
          )}>
          <Heart size={12} fill={template.isFavorite ? 'currentColor' : 'none'}/>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-primary leading-snug">{template.name}</h3>
          <Badge variant="secondary" size="xs" className="shrink-0">{PLANNER_TYPE_LABELS[template.type as PlannerType] ?? template.type}</Badge>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-2.5">{template.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-ink-faint flex items-center gap-1"><Download size={9}/>{template.downloads.toLocaleString()}</span>
          <div className="flex gap-1 flex-wrap justify-end">
            {template.tags.slice(0,2).map(tag => (
              <span key={tag} className="text-[9px] bg-white/80 text-ink-muted px-1.5 py-0.5 rounded border border-white/80 shadow-xs">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { getFiltered, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, toggleFavorite } = useTemplateStore()
  const { importPlanner, setActivePlanner } = usePlannerStore()
  const { toast } = useUIStore()
  const { trackTemplateUsed } = useAnalyticsStore()
  const [favOnly, setFavOnly] = React.useState(false)

  let templates = getFiltered()
  if (favOnly) templates = templates.filter(t => t.isFavorite)

  const handleUse = (tpl: Template) => {
    const p = importPlanner({
      name: tpl.name,
      description: tpl.description,
      type: tpl.type,
      pages: tpl.pages,
      config: tpl.config,
      tags: tpl.tags,
    })
    setActivePlanner(p.id)
    trackTemplateUsed()
    toast(`Started from "${tpl.name}"`, 'success')
    navigate('/builder')
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Templates" subtitle={`${templates.length} planner layouts ready to use`}
        actions={
          <Button variant={favOnly ? 'secondary' : 'outline'} size="sm" onClick={()=>setFavOnly(!favOnly)}>
            <Heart size={13} fill={favOnly?'currentColor':'none'}/> Favorites
          </Button>
        }
      />

      <div className="flex-1 overflow-auto">
        {/* Sticky filters */}
        <div className="sticky top-0 z-10 bg-white/80 border-b border-white/70 px-6 py-3 space-y-3 backdrop-blur-xl toolbar-shadow">
          <div className="relative max-w-sm">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"/>
            <input type="search" placeholder="Search templates…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 text-xs rounded-lg border border-white/80 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 shadow-xs"/>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button key={cat} onClick={()=>setSelectedCategory(cat)}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                  selectedCategory===cat
                    ? 'bg-primary text-white border-primary'
                    : 'border-white/80 text-ink-muted hover:border-border-strong hover:text-primary bg-white/80 shadow-xs'
                )}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {templates.length === 0 ? (
            <EmptyState icon={<Search size={28}/>}
              title={favOnly ? 'No favorites yet' : 'No templates match your search'}
              description={favOnly ? 'Heart any template to save it here.' : 'Try a different term or category.'}
              action={
                <Button variant="outline" size="sm" onClick={()=>{setSearchQuery('');setSelectedCategory('All');setFavOnly(false)}}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {templates.map(tpl => (
                  <TemplateCard key={tpl.id} template={tpl} onUse={()=>handleUse(tpl)} onToggleFav={()=>toggleFavorite(tpl.id)}/>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
