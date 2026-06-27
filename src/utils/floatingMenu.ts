import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

type Align = 'left' | 'right'

export function useFloatingMenu(open: boolean, align: Align = 'left', matchWidth = false) {
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})

  const updatePosition = useCallback(() => {
    const el = containerRef.current
    if (!el || !open) return

    const rect = el.getBoundingClientRect()
    const style: CSSProperties = {
      position: 'fixed',
      top: rect.bottom + 8,
      zIndex: 9999,
    }

    if (matchWidth) {
      style.left = rect.left
      style.width = rect.width
    } else if (align === 'right') {
      style.left = rect.right
      style.transform = 'translateX(-100%)'
    } else {
      style.left = rect.left
    }

    setMenuStyle(style)
  }, [open, align, matchWidth])

  useEffect(() => {
    if (!open) return
    updatePosition()
    const onUpdate = () => updatePosition()
    window.addEventListener('scroll', onUpdate, true)
    window.addEventListener('resize', onUpdate)
    return () => {
      window.removeEventListener('scroll', onUpdate, true)
      window.removeEventListener('resize', onUpdate)
    }
  }, [open, updatePosition])

  const isOutside = useCallback((target: Node) => {
    return !containerRef.current?.contains(target) && !menuRef.current?.contains(target)
  }, [])

  return { containerRef, menuRef, menuStyle, isOutside }
}
