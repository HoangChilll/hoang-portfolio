"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const DEFAULT_LEFT = 80   // ~2cm
const MIN_LEFT = 24
const MAX_LEFT = 320

export function BlogLayout({ children }: { children: React.ReactNode }) {
  const [leftOffset, setLeftOffset] = useState(DEFAULT_LEFT)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startOffset = useRef(DEFAULT_LEFT)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    startX.current = e.clientX
    startOffset.current = leftOffset
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [leftOffset])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const delta = e.clientX - startX.current
      const next = Math.min(MAX_LEFT, Math.max(MIN_LEFT, startOffset.current + delta))
      setLeftOffset(next)
    }
    const onMouseUp = () => {
      if (!dragging.current) return
      dragging.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  return (
    <div style={{ marginLeft: leftOffset }} className="relative max-w-3xl py-24 pr-4">
      {/* Left drag handle */}
      <div
        onMouseDown={onMouseDown}
        className="absolute -left-3 top-0 bottom-0 w-3 cursor-col-resize group hidden lg:flex items-center justify-center"
        title="Kéo để thay đổi vị trí"
      >
        <div className="w-0.5 h-12 rounded-full bg-border group-hover:bg-foreground/30 transition-colors" />
      </div>

      {children}
    </div>
  )
}
