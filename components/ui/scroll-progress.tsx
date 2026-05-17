"use client"

import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    function update() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const scrollable = scrollHeight - clientHeight
      const progress = scrollable > 0 ? scrollTop / scrollable : 0
      bar!.style.transform = `scaleX(${progress})`
    }

    function onScroll() {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        update()
        rafRef.current = null
      })
    }

    // Set initial value without waiting for a scroll event
    update()

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9998] h-[2px] w-full"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left"
        style={{
          transform: "scaleX(0)",
          background:
            "linear-gradient(to right, oklch(0.55 0.18 264), oklch(0.65 0.2 300))",
        }}
      />
    </div>
  )
}
