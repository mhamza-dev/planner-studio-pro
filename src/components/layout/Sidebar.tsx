import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PenTool, BookOpen, Download, Settings,
  ChevronLeft, ChevronRight, Pen, Sparkles
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useUIStore } from '@/store/uiStore'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'

const navItems = [
  { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/builder', icon: <PenTool size={18} />, label: 'Builder' },
  { to: '/templates', icon: <BookOpen size={18} />, label: 'Templates' },
  { to: '/downloads', icon: <Download size={18} />, label: 'Downloads' },
  { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
]

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex-shrink-0 bg-paper border-r border-border shadow-sidebar flex flex-col overflow-hidden relative z-10"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-3 border-b border-border flex-shrink-0">
        <AnimatePresence mode="wait">
          {sidebarCollapsed ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mx-auto"
            >
              <Pen size={14} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Pen size={14} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-primary leading-none font-display">Planner</div>
                <div className="text-xs text-secondary leading-none mt-0.5">Studio Pro</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to)

          const linkContent = (
            <NavLink
              to={item.to}
              className={cn(
                'flex items-center gap-3 h-9 px-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-secondary hover:bg-background hover:text-primary'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="flex-shrink-0 w-4.5 flex items-center justify-center">{item.icon}</span>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.to} content={item.label} side="right">
                {linkContent}
              </Tooltip>
            )
          }

          return <div key={item.to}>{linkContent}</div>
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 pt-2 border-t border-border flex-shrink-0">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-2 mx-0.5 p-3 rounded-xl bg-background border border-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={12} className="text-brand-gold flex-shrink-0" />
              <span className="text-xs font-semibold text-primary">Pro Plan</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Unlimited exports & premium templates
            </p>
          </motion.div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2 w-full h-8 px-2 rounded-lg text-xs font-medium',
            'text-secondary hover:bg-background hover:text-primary transition-colors duration-150',
            sidebarCollapsed && 'justify-center'
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : (
            <>
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
