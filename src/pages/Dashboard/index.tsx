import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, PenTool, BookOpen, Download, LayoutGrid, List,
  Search, Folder, FolderPlus, Trash2, Copy, MoreHorizontal,
  Clock, FileText, Star, TrendingUp, ChevronRight, Edit3,
  Sparkles, Palette, Flame, Zap,
} from 'lucide-react'
import { TopBar } from '@/components/layout/index'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/Input'
import { Badge } from '@/components/ui/index'
import { Dropdown } from '@/components/ui/index'
import { EmptyState } from '@/components/ui/index'
import { ConfirmDialog } from '@/components/ui/Modal'
import { usePlannerStore } from '@/store/plannerStore'
import { useUIStore } from '@/store/uiStore'
import { useTemplateStore } from '@/store/templateStore'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { CreatePlannerModal } from '@/features/dashboard/CreatePlannerModal'
import { PLANNER_TYPE_LABELS } from '@/lib/defaults'
import { THEMES, THEME_LIST } from '@/themes'
import { TEMPLATES } from '@/lib/templates'
import type { Planner, PlannerType } from '@/types'
import { cn } from '@/utils/cn'

const TYPE_COLORS: Record<string, string> = {
  daily:'#6366F1', weekly:'#8B5CF6', monthly:'#0EA5E9', habit:'#10B981',
  budget:'#F59E0B', wellness:'#EC4899', fitness:'#EF4444', student:'#F97316',
  business:'#1E293B', journal:'#84CC16', workbook:'#06B6D4', worksheet:'#6366F1',
  creative:'#A855F7', adhd:'#FF6B9D', teacher:'#20B2AA', wedding:'#C2185B',
  kids:'#FF8C00', finance:'#2E8B57',
}

const STATUS_VARIANTS: Record<string, any> = {
  draft: 'secondary', active: 'success', archived: 'warning', sold: 'accent',
}

function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime()
  if (d < 60000) return 'just now'
  if (d < 3600000) return `${Math.floor(d/60000)}m ago`
  if (d < 86400000) return `${Math.floor(d/3600000)}h ago`
  if (d < 604800000) return `${Math.floor(d/86400000)}d ago`
  return new Date(iso).toLocaleDateString()
}

function PlannerCard({ planner, onOpen, onDuplicate, onDelete }: {
  planner: Planner; onOpen:()=>void; onDuplicate:()=>void; onDelete:()=>void
}) {
  const color = TYPE_COLORS[planner.type] ?? '#6366F1'
  const theme = THEMES[planner.config.themeId || 'minimalist'] || THEMES.minimalist
  const [renaming, setRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(planner.name)
  const { renamePlanner } = usePlannerStore()
  const commitRename = () => { if (renameVal.trim()) renamePlanner(planner.id, renameVal.trim()); setRenaming(false) }

  return (
    <motion.div layout initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.97 }}
      className="relative group glass-panel rounded-xl hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div className="h-36 relative overflow-hidden flex items-center justify-center"
        style={{ background: theme.gradient }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 25% 25%, ${theme.colors.accent}30, transparent 55%)` }} />

        {/* Mini paper preview */}
        <div className="relative w-[72px] h-[90px] rounded-lg shadow-paper border flex flex-col overflow-hidden -rotate-2 group-hover:rotate-0 transition-transform duration-300"
          style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
          <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.secondary})` }} />
          <div className="flex-1 p-1.5 flex flex-col gap-1">
            <div className="h-[6px] w-[55%] rounded-sm" style={{ backgroundColor: theme.colors.primary }} />
            {[70, 55, 65, 45, 60].map((w, i) => (
              <div key={i} className="rounded-sm" style={{ height: 1.5, width: `${w}%`, backgroundColor: theme.colors.border }} />
            ))}
            <div className="mt-auto grid grid-cols-3 gap-0.5">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className="h-2 rounded-sm" style={{ backgroundColor: i < 2 ? `${theme.colors.accent}50` : `${theme.colors.border}80` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/15 backdrop-blur-[2px]">
          <div className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-float">
            <PenTool size={11}/> Open Builder
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={STATUS_VARIANTS[planner.status] ?? 'secondary'} size="xs">{planner.status}</Badge>
        </div>

        {/* Theme pill */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-full text-[8px] font-semibold"
          style={{ backgroundColor: `${theme.colors.accent}30`, color: theme.colors.primary }}>
          {theme.emoji}
        </div>
      </div>

      {/* Options menu */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <Dropdown align="right"
          trigger={
            <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 shadow-sm hover:bg-white transition-colors">
              <MoreHorizontal size={13} className="text-primary"/>
            </button>
          }
          items={[
            { label:'Open Builder', icon:<PenTool size={13}/>, onClick:onOpen },
            { label:'Rename', icon:<Edit3 size={13}/>, onClick:()=>setRenaming(true) },
            { label:'Duplicate', icon:<Copy size={13}/>, onClick:onDuplicate },
            { separator:true },
            { label:'Delete', icon:<Trash2 size={13}/>, onClick:onDelete, danger:true },
          ]}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        {renaming ? (
          <input autoFocus value={renameVal} onChange={e=>setRenameVal(e.target.value)}
            onBlur={commitRename} onKeyDown={e=>{if(e.key==='Enter')commitRename();if(e.key==='Escape')setRenaming(false)}}
            onClick={e=>e.stopPropagation()}
            className="w-full text-sm font-semibold text-primary bg-transparent border-b border-accent outline-none mb-1"/>
        ) : (
          <h3 className="text-sm font-bold text-primary truncate mb-1">{planner.name}</h3>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor:`${color}15`, color }}>
            {PLANNER_TYPE_LABELS[planner.type as PlannerType] ?? planner.type}
          </span>
          <span className="text-[10px] text-ink-faint flex items-center gap-1">
            <Clock size={9}/> {timeAgo(planner.updatedAt)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-ink-faint">
          <span>{planner.pages.length} page{planner.pages.length !== 1 ? 's' : ''}</span>
          <span>{planner.pages.reduce((s,p)=>s+p.blocks.length,0)} blocks</span>
          <span className="ml-auto">{theme.emoji} {theme.name}</span>
        </div>
      </div>
    </motion.div>
  )
}

function PlannerRow({ planner, onOpen, onDuplicate, onDelete }:{
  planner:Planner; onOpen:()=>void; onDuplicate:()=>void; onDelete:()=>void
}) {
  const color = TYPE_COLORS[planner.type] ?? '#6366F1'
  const theme = THEMES[planner.config.themeId || 'minimalist'] || THEMES.minimalist
  return (
    <motion.div layout initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="group flex items-center gap-4 px-4 py-3 glass-panel rounded-xl hover:shadow-card hover:bg-white transition-all cursor-pointer"
      onClick={onOpen}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-base"
        style={{ background: theme.gradient }}>{theme.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-primary truncate">{planner.name}</div>
        <div className="text-xs text-ink-muted mt-0.5">
          {PLANNER_TYPE_LABELS[planner.type as PlannerType]} · {planner.pages.length} pages · {timeAgo(planner.updatedAt)}
        </div>
      </div>
      <Badge variant={STATUS_VARIANTS[planner.status] ?? 'secondary'} size="xs">{planner.status}</Badge>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e=>e.stopPropagation()}>
        <Button variant="ghost" size="icon-xs" onClick={onDuplicate}><Copy size={12}/></Button>
        <Button variant="ghost" size="icon-xs" onClick={onDelete} className="text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={12}/></Button>
      </div>
      <ChevronRight size={14} className="text-ink-faint shrink-0"/>
    </motion.div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { planners, folders, setActivePlanner, duplicatePlanner, deletePlanner, createFolder } = usePlannerStore()
  const {
    setCreateModalOpen, dashboardView, setDashboardView,
    dashboardSort, setDashboardSort, dashboardSearch, setDashboardSearch,
    dashboardFilter, setDashboardFilter, activeFolderId, setActiveFolderId, toast,
  } = useUIStore()
  const { getFiltered } = useTemplateStore()
  const { stats } = useAnalyticsStore()
  const [deleteId, setDeleteId] = useState<string|null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [showFolderInput, setShowFolderInput] = useState(false)

  const handleOpen = (p: Planner) => { setActivePlanner(p.id); navigate('/builder') }
  const handleDelete = (id: string) => { setDeleteId(null); deletePlanner(id); toast('Planner deleted', 'info') }
  const handleDuplicate = (id: string) => { duplicatePlanner(id); toast('Planner duplicated', 'success') }

  const filtered = useMemo(() => {
    let list = [...planners]
    if (activeFolderId) list = list.filter(p => p.folderId === activeFolderId)
    if (dashboardFilter === 'active') list = list.filter(p => p.status === 'active')
    if (dashboardFilter === 'archived') list = list.filter(p => p.status === 'archived')
    if (dashboardSearch) {
      const q = dashboardSearch.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      if (dashboardSort === 'name') return a.name.localeCompare(b.name)
      if (dashboardSort === 'type') return a.type.localeCompare(b.type)
      if (dashboardSort === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    return list
  }, [planners, activeFolderId, dashboardFilter, dashboardSearch, dashboardSort])

  const statCards = [
    { label:'Planners', value:planners.length, icon:<FileText size={15}/>, color:'bg-blue-50 text-blue-600', border:'border-blue-100' },
    { label:'Templates', value:TEMPLATES.length, icon:<BookOpen size={15}/>, color:'bg-emerald-50 text-emerald-600', border:'border-emerald-100' },
    { label:'Exports', value:stats.exportsCompleted, icon:<Download size={15}/>, color:'bg-amber-50 text-amber-600', border:'border-amber-100' },
    { label:'Blocks Added', value:stats.blocksAdded, icon:<TrendingUp size={15}/>, color:'bg-rose-50 text-rose-600', border:'border-rose-100' },
  ]

  const trendingTemplates = TEMPLATES.filter(t => t.isTrending || t.isBestseller).slice(0, 4)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Dashboard" subtitle="Your planner workspace"
        actions={<Button size="sm" onClick={() => setCreateModalOpen(true)}><Plus size={14}/> New Planner</Button>}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-[1500px]">

          {/* Hero banner */}
          <section className="relative overflow-hidden rounded-2xl border border-white/70 bg-primary p-6 text-white shadow-paper">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,.42),transparent_45%),linear-gradient(90deg,transparent,rgba(249,115,22,.18))]"/>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-blue-100">
                  <Sparkles size={12}/> {TEMPLATES.length} premium templates · 15 theme packs
                </div>
                <h2 className="font-display text-3xl font-bold leading-tight">Design, package, and ship premium planners faster.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">Build print-ready planner products with reusable templates, live editing, 15 theme packs, and sales-focused tools in one studio.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="lg" className="bg-white text-primary hover:bg-slate-100" onClick={() => setCreateModalOpen(true)}>
                  <Plus size={16}/> New Planner
                </Button>
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 hover:text-white" onClick={() => navigate('/templates')}>
                  <BookOpen size={16}/> Browse Templates
                </Button>
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 hover:text-white" onClick={() => navigate('/settings')}>
                  <Palette size={16}/> Theme Studio
                </Button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(s => (
              <motion.div key={s.label} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                className={cn('glass-panel rounded-xl p-4 border', s.border)}>
                <div className="flex items-center justify-between mb-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', s.color)}>{s.icon}</div>
                  <span className="text-2xl font-bold text-primary font-display">{s.value}</span>
                </div>
                <p className="text-xs text-ink-muted">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon:<Zap size={18}/>, label:'Quick Create', desc:'Start a new planner in seconds', action:()=>setCreateModalOpen(true), color:'#6366F1' },
              { icon:<BookOpen size={18}/>, label:'Templates', desc:`${TEMPLATES.length} professional layouts`, action:()=>navigate('/templates'), color:'#10B981' },
              { icon:<Palette size={18}/>, label:'15 Themes', desc:'Switch any planner\'s aesthetic', action:()=>navigate('/settings'), color:'#F59E0B' },
              { icon:<Flame size={18}/>, label:'Etsy Tools', desc:'SEO, listings & pricing', action:()=>navigate('/etsy'), color:'#EF4444' },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className="text-left p-4 rounded-xl border border-white/70 bg-white/60 backdrop-blur hover:-translate-y-0.5 hover:shadow-card transition-all group"
                style={{ borderLeft: `3px solid ${item.color}20` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-white"
                  style={{ backgroundColor: item.color }}>{item.icon}</div>
                <div className="text-sm font-semibold text-primary mb-0.5">{item.label}</div>
                <div className="text-xs text-ink-muted">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Folders sidebar */}
            <div className="w-52 shrink-0 space-y-1 rounded-xl border border-white/70 bg-white/65 p-3 shadow-xs backdrop-blur h-fit">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint mb-2 px-1">Folders</p>
              {[{ id: null, name: 'All Planners', icon: <LayoutGrid size={13}/> }].concat(
                folders.map(f => ({ id: f.id as any, name: f.name, icon: <Folder size={13}/> }))
              ).map(item => (
                <button key={String(item.id)} onClick={() => setActiveFolderId(item.id as any)}
                  className={cn(
                    'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    activeFolderId === item.id ? 'bg-primary text-white shadow-card' : 'text-ink-muted hover:bg-white hover:text-primary'
                  )}>
                  {item.icon}
                  <span className="truncate flex-1">{item.name}</span>
                  {item.id && <span className="text-[9px] opacity-50">{planners.filter(p=>p.folderId===item.id).length}</span>}
                </button>
              ))}
              {showFolderInput ? (
                <div className="flex items-center gap-1 px-1">
                  <input autoFocus value={newFolderName} onChange={e=>setNewFolderName(e.target.value)}
                    onKeyDown={e=>{
                      if(e.key==='Enter'&&newFolderName.trim()){createFolder(newFolderName.trim());setNewFolderName('');setShowFolderInput(false)}
                      if(e.key==='Escape'){setShowFolderInput(false);setNewFolderName('')}
                    }}
                    className="flex-1 h-6 px-1.5 text-xs rounded border border-border focus:outline-none bg-paper"
                    placeholder="Folder name"/>
                </div>
              ) : (
                <button onClick={()=>setShowFolderInput(true)}
                  className="flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-xs text-ink-faint hover:bg-white hover:text-accent transition-colors">
                  <FolderPlus size={12}/> New folder
                </button>
              )}
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-4 rounded-xl border border-white/70 bg-white/65 p-2 shadow-xs backdrop-blur">
                <div className="relative flex-1 max-w-xs">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"/>
                  <input type="search" placeholder="Search planners…" value={dashboardSearch}
                    onChange={e=>setDashboardSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 text-xs rounded-lg border border-white/80 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 shadow-xs"/>
                </div>
                <CustomSelect value={dashboardFilter} onChange={setDashboardFilter}
                  options={[{value:'all',label:'All status'},{value:'active',label:'Active'},{value:'archived',label:'Archived'}]}
                  className="w-36 shrink-0" buttonClassName="h-9 text-xs"/>
                <CustomSelect value={dashboardSort} onChange={v=>setDashboardSort(v as any)}
                  options={[{value:'updatedAt',label:'Recently edited'},{value:'createdAt',label:'Recently created'},{value:'name',label:'Name A-Z'},{value:'type',label:'Type'}]}
                  className="w-44 shrink-0" buttonClassName="h-9 text-xs"/>
                <div className="flex items-center border border-white/80 rounded-lg overflow-hidden bg-white shadow-xs">
                  <button onClick={()=>setDashboardView('grid')} className={cn('w-8 h-8 flex items-center justify-center transition-colors', dashboardView==='grid'?'bg-primary text-white':'text-ink-muted hover:bg-surface-raised')}>
                    <LayoutGrid size={13}/>
                  </button>
                  <button onClick={()=>setDashboardView('list')} className={cn('w-8 h-8 flex items-center justify-center transition-colors', dashboardView==='list'?'bg-primary text-white':'text-ink-muted hover:bg-surface-raised')}>
                    <List size={13}/>
                  </button>
                </div>
              </div>

              {planners.length === 0 ? (
                <div className="bg-paper rounded-2xl border-2 border-dashed border-border p-12">
                  <EmptyState icon={<PenTool size={32}/>}
                    title="No planners yet"
                    description="Create your first planner to get started. Choose from templates or start blank."
                    action={<Button onClick={()=>setCreateModalOpen(true)}><Plus size={14}/> Create your first planner</Button>}
                  />
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState icon={<Search size={28}/>}
                  title="No planners match your search"
                  description="Try adjusting your filters or search term."
                  action={<Button variant="outline" size="sm" onClick={()=>{setDashboardSearch('');setDashboardFilter('all')}}>Clear filters</Button>}
                />
              ) : dashboardView === 'grid' ? (
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <motion.button layout onClick={()=>setCreateModalOpen(true)}
                    className="flex flex-col items-center justify-center gap-2.5 h-full min-h-[210px] rounded-xl border-2 border-dashed border-blue-200 bg-white/45 hover:border-accent hover:bg-white/80 transition-all group">
                    <div className="w-11 h-11 rounded-full bg-blue-100 group-hover:bg-accent flex items-center justify-center transition-colors shadow-xs">
                      <Plus size={18} className="text-accent group-hover:text-white transition-colors"/>
                    </div>
                    <span className="text-xs font-medium text-ink-muted group-hover:text-accent transition-colors">New Planner</span>
                  </motion.button>
                  <AnimatePresence mode="popLayout">
                    {filtered.map(p => (
                      <PlannerCard key={p.id} planner={p} onOpen={()=>handleOpen(p)}
                        onDuplicate={()=>handleDuplicate(p.id)} onDelete={()=>setDeleteId(p.id)}/>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {filtered.map(p => (
                      <PlannerRow key={p.id} planner={p} onOpen={()=>handleOpen(p)}
                        onDuplicate={()=>handleDuplicate(p.id)} onDelete={()=>setDeleteId(p.id)}/>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Trending templates */}
          {trendingTemplates.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-primary flex items-center gap-1.5">
                  <Flame size={14} className="text-orange-500"/> Trending Templates
                </h2>
                <Button variant="ghost" size="sm" onClick={()=>navigate('/templates')}>
                  Browse all {TEMPLATES.length} templates <ChevronRight size={13}/>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {trendingTemplates.map(tpl => {
                  const theme = THEMES[tpl.themeId || 'minimalist'] || THEMES.minimalist
                  return (
                    <motion.button key={tpl.id} whileHover={{scale:1.01}} whileTap={{scale:0.99}}
                      onClick={()=>navigate('/templates')}
                      className="glass-panel rounded-xl p-4 text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden relative">
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: theme.gradient }} />
                      <div className="relative">
                        <div className="text-lg mb-1">{theme.emoji}</div>
                        <div className="text-xs font-bold text-primary mb-1">{tpl.name}</div>
                        <div className="text-[11px] text-ink-muted line-clamp-2 mb-2">{tpl.description}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-ink-faint">{tpl.downloads.toLocaleString()} downloads</span>
                          {tpl.isPremium && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:'linear-gradient(135deg,#F59E0B,#D97706)',color:'white'}}>PRO</span>}
                          {tpl.isBestseller && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">BEST</span>}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <CreatePlannerModal/>
      <ConfirmDialog
        open={!!deleteId} onClose={()=>setDeleteId(null)}
        onConfirm={()=>deleteId&&handleDelete(deleteId)}
        title="Delete this planner?"
        description="This action cannot be undone. The planner and all its pages will be permanently deleted."
        confirmLabel="Delete" danger
      />
    </div>
  )
}
