"use client"

import { useEffect, useState } from "react"
import type { Heading } from "@/lib/markdown"

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("")

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

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 hidden lg:block w-52 shrink-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              style={{ paddingLeft: `${(level - 1) * 12 + 12}px` }}
              className={`block py-0.5 text-sm transition-colors hover:text-foreground ${
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
