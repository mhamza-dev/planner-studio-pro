import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PenTool, BookOpen, Download, Settings,
  BarChart3, ShoppingBag, ChevronLeft, ChevronRight, Pen,
  Sparkles, FolderOpen,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useUIStore } from '@/store/uiStore'
import { usePlannerStore } from '@/store/plannerStore'
import { Tooltip } from './index'

const NAV = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/builder',    label: 'Builder',    icon: PenTool },
  { to: '/templates',  label: 'Templates',  icon: BookOpen },
  { to: '/analytics',  label: 'Analytics',  icon: BarChart3 },
  { to: '/etsy',       label: 'Etsy Tools', icon: ShoppingBag },
  { to: '/downloads',  label: 'Downloads',  icon: Download },
  { to: '/settings',   label: 'Settings',   icon: Settings },
]

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { planners } = usePlannerStore()
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 56 : 220 }}
      transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}
      className="h-full shrink-0 bg-paper border-r border-border flex flex-col overflow-hidden relative z-10"
      style={{ boxShadow: '1px 0 0 #E4E4E7' }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-3 border-b border-border shrink-0">
        <AnimatePresence mode="wait">
          {sidebarCollapsed ? (
            <motion.div key="icon"
              initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.8}}
              className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center mx-auto">
              <Pen size={14} className="text-white"/>
            </motion.div>
          ) : (
            <motion.div key="full"
              initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}}
              className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Pen size={14} className="text-white"/>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-primary leading-none font-display">Planner</div>
                <div className="text-[11px] text-ink-muted leading-none mt-0.5">Studio Pro</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => {
          const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
          const link = (
            <NavLink to={to}
              className={cn(
                'flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-[13px] font-medium transition-all duration-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
                isActive ? 'bg-primary text-white' : 'text-ink-muted hover:bg-surface-raised hover:text-primary',
                sidebarCollapsed && 'justify-center px-0'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} className="shrink-0"/>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{opacity:0,width:0}} animate={{opacity:1,width:'auto'}} exit={{opacity:0,width:0}}
                    className="truncate overflow-hidden whitespace-nowrap"
                  >{label}</motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )
          return sidebarCollapsed
            ? <Tooltip key={to} content={label} side="right" delay={100}>{link}</Tooltip>
            : <div key={to}>{link}</div>
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 pt-2 border-t border-border shrink-0 space-y-1">
        {!sidebarCollapsed && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            className="mb-2 mx-0.5 p-3 rounded-xl bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={11} className="text-accent shrink-0"/>
              <span className="text-xs font-semibold text-accent">Pro Plan</span>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">Unlimited exports & premium templates</p>
          </motion.div>
        )}
        <button onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2 w-full h-8 px-2.5 rounded-lg text-xs font-medium text-ink-muted hover:bg-surface-raised hover:text-primary transition-colors',
            sidebarCollapsed && 'justify-center px-0'
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={14}/> : <><ChevronLeft size={14}/><span>Collapse</span></>}
        </button>
      </div>
    </motion.aside>
  )
}
