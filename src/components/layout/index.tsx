import React, { Component, type ReactNode, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { ToastContainer } from '../ui/index'
import { Button } from '../ui/Button'
import { cn } from '@/utils/cn'
import { CommandPalette } from '@/features/dashboard/CommandPalette'
import { ShortcutsModal, OnboardingModal } from '@/features/dashboard/Modals'
import { useUIStore } from '@/store/uiStore'

// ── TopBar ────────────────────────────────────────────────────────────────────
interface TopBarProps {
  title: string; subtitle?: string; actions?: React.ReactNode; className?: string
  breadcrumb?: { label: string; href?: string }[]
}
export const TopBar: React.FC<TopBarProps> = ({ title, subtitle, actions, className, breadcrumb }) => (
  <div className={cn('h-16 flex items-center justify-between px-6 border-b border-white/70 bg-white/80 backdrop-blur-xl shrink-0 toolbar-shadow', className)}>
    <div className="min-w-0">
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex items-center gap-1 mb-0.5">
          {breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-ink-faint text-xs">/</span>}
              <span className="text-[11px] font-medium text-ink-muted">{b.label}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <h1 className="text-lg font-bold text-primary truncate font-display">{title}</h1>
      {subtitle && <p className="text-xs text-ink-muted mt-0.5 truncate">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 ml-4 shrink-0">{actions}</div>}
  </div>
)

// ── Global Handlers ───────────────────────────────────────────────────────────
function GlobalKeyHandler() {
  const { setCommandPaletteOpen, setShortcutsModalOpen } = useUIStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if (e.key === '?' && !(e.target as HTMLElement).matches('input,textarea')) {
        setShortcutsModalOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandPaletteOpen, setShortcutsModalOpen])

  return null
}

function OnboardingGate() {
  const { onboardingCompleted, onboardingOpen, setOnboardingOpen } = useUIStore()

  useEffect(() => {
    if (!onboardingCompleted) {
      const t = setTimeout(() => setOnboardingOpen(true), 600)
      return () => clearTimeout(t)
    }
  }, [onboardingCompleted, setOnboardingOpen])

  return <OnboardingModal/>
}

// ── AppLayout ─────────────────────────────────────────────────────────────────
export const AppLayout: React.FC = () => (
  <div className="flex h-screen overflow-hidden bg-transparent">
    <Sidebar/>
    <main className="flex-1 min-w-0 overflow-auto flex flex-col">
      <Outlet/>
    </main>
    <ToastContainer/>
    <CommandPalette/>
    <ShortcutsModal/>
    <OnboardingGate/>
    <GlobalKeyHandler/>
  </div>
)

// ── ErrorBoundary ─────────────────────────────────────────────────────────────
interface EBState { hasError: boolean; error: Error | null }
export class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error): EBState { return { hasError: true, error } }
  render() {
    if (this.state.hasError) return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-500"/>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-primary mb-1">Something went wrong</h2>
          <p className="text-xs text-ink-muted max-w-sm">{this.state.error?.message}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => this.setState({ hasError: false, error: null })}>
          <RefreshCw size={13}/> Try again
        </Button>
      </div>
    )
    return this.props.children
  }
}

// ── PageLoader ─────────────────────────────────────────────────────────────────
export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-full min-h-[300px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin"/>
      <span className="text-xs text-ink-muted">Loading…</span>
    </div>
  </div>
)
