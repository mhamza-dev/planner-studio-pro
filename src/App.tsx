import React, { useEffect } from 'react'
import { AppRouter } from './app/router'
import { CommandPalette } from './features/dashboard/CommandPalette'
import { ShortcutsModal, OnboardingModal } from './features/dashboard/Modals'
import { useUIStore } from './store/uiStore'

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

export default function App() {
  return (
    <>
      <AppRouter/>
      <CommandPalette/>
      <ShortcutsModal/>
      <OnboardingGate/>
      <GlobalKeyHandler/>
    </>
  )
}
