import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Download, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Template } from '@/types'
import { PLANNER_TYPE_LABELS } from '@/lib/defaults'
import { cn } from '@/utils/cn'

const TYPE_ICONS: Record<string, string> = {
  daily: '📅', weekly: '🗓', monthly: '📆', habit: '✅',
  budget: '💰', wellness: '🌿', fitness: '💪', student: '📚', business: '💼',
}

const PALETTE_BG: Record<string, string> = {
  tpl_daily_minimal: 'linear-gradient(135deg, #F8F6F2 0%, #EDE9E4 100%)',
  tpl_daily_sage: 'linear-gradient(135deg, #E8F0E5 0%, #C8D5B9 100%)',
  tpl_weekly_classic: 'linear-gradient(135deg, #E8EFF8 0%, #B8D4E8 100%)',
  tpl_monthly_calendar: 'linear-gradient(135deg, #E8EEF8 0%, #B8CBE8 100%)',
  tpl_habit_tracker: 'linear-gradient(135deg, #EDE8F8 0%, #D4C5F9 100%)',
  tpl_budget_planner: 'linear-gradient(135deg, #E8F0E5 0%, #B9D4BC 100%)',
  tpl_wellness_tracker: 'linear-gradient(135deg, #F8E8F6 0%, #F2C4CE 100%)',
  tpl_fitness_log: 'linear-gradient(135deg, #EEEEEE 0%, #CCCCCC 100%)',
  tpl_student_planner: 'linear-gradient(135deg, #FDF0E8 0%, #F2C49B 100%)',
  tpl_business_pro: 'linear-gradient(135deg, #F2F2F2 0%, #D6CFC7 100%)',
  tpl_weekly_blush: 'linear-gradient(135deg, #FDE8F4 0%, #F2C4CE 100%)',
  tpl_daily_business: 'linear-gradient(135deg, #E8EEF8 0%, #B8CBE8 100%)',
}

interface TemplateCardProps {
  template: Template
  onUse: (template: Template) => void
  onToggleFavorite: (id: string) => void
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse, onToggleFavorite }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-paper rounded-xl border border-border shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-200"
    >
      {/* Thumbnail */}
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: PALETTE_BG[template.id] || 'linear-gradient(135deg, #F8F6F2 0%, #EDE9E4 100%)' }}
      >
        <span className="text-5xl opacity-50 group-hover:scale-110 transition-transform duration-300">
          {TYPE_ICONS[template.type]}
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 backdrop-blur-sm">
          <Button
            size="sm"
            onClick={() => onUse(template)}
            className="shadow-float"
          >
            Use Template
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {template.isPremium && (
            <Badge variant="premium" size="sm">
              <Sparkles size={9} />
              Pro
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(template.id) }}
          className={cn(
            'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all',
            'opacity-0 group-hover:opacity-100',
            template.isFavorite
              ? 'bg-red-500 text-white opacity-100'
              : 'bg-paper/80 text-secondary hover:text-red-500'
          )}
          aria-label={template.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={13} fill={template.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-primary leading-snug">{template.name}</h3>
          <Badge variant="secondary" size="sm">{PLANNER_TYPE_LABELS[template.type]}</Badge>
        </div>
        <p className="text-xs text-secondary leading-snug line-clamp-2 mb-3">{template.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-secondary flex items-center gap-1">
            <Download size={10} />
            {template.downloads.toLocaleString()}
          </span>
          <div className="flex gap-1 flex-wrap">
            {template.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] bg-background text-secondary px-1.5 py-0.5 rounded-md border border-border">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
