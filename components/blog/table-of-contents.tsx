"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Download } from "lucide-react"
import type { Heading } from "@/lib/markdown"

const MIN_WIDTH = 160
const MAX_WIDTH = 480
const DEFAULT_WIDTH = 224

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("")
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(DEFAULT_WIDTH)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "0% 0% -75% 0%" }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    startX.current = e.clientX
    startWidth.current = width
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [width])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const delta = startX.current - e.clientX
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta))
      setWidth(next)
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

  if (headings.length === 0) return null

  return (
    <nav
      style={{ width }}
      className="fixed right-0 top-14 bottom-0 hidden lg:flex flex-col border-l border-border bg-background/95 backdrop-blur-sm z-40"
    >
      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-foreground/20 transition-colors"
        title="Kéo để thay đổi độ rộng"
      />

      <div className="px-4 pt-5 pb-3 flex items-center justify-between shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          On this page
        </p>
        <button
          onClick={() => window.print()}
          title="Tải PDF"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Download className="size-3.5" />
          PDF
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto border-l border-border ml-4 pb-6">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              style={{ paddingLeft: `${(level - 1) * 12 + 12}px` }}
              className={`block py-1 pr-3 text-sm transition-colors hover:text-foreground break-words ${
                activeId === id
                  ? "text-foreground font-medium border-l-2 border-foreground -ml-px"
                  : "text-muted-foreground"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
