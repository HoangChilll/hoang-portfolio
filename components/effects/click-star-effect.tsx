"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// ─── Config ────────────────────────────────────────────────────────────────

const COLORS = [
  "#ffffff",  // white
  "#fde68a",  // soft yellow
  "#bae6fd",  // sky blue
  "#e9d5ff",  // lavender
  "#bbf7d0",  // mint
] as const

const MIN_PARTICLES = 6
const MAX_PARTICLES = 12
const MAX_BURSTS    = 20       // max concurrent burst groups on screen
const MIN_DISTANCE  = 24       // px
const MAX_DISTANCE  = 58       // px
const MIN_SIZE      = 4        // px
const MAX_SIZE      = 9        // px
const MIN_DURATION  = 600      // ms
const MAX_DURATION  = 900      // ms

// ─── Types ─────────────────────────────────────────────────────────────────

interface Particle {
  id: number
  tx: number       // final X translation
  ty: number       // final Y translation
  size: number
  color: string
  duration: number
  rotation: number // deg, for subtle spin
}

interface Burst {
  id: number
  x: number        // viewport X of click
  y: number        // viewport Y of click
  particles: Particle[]
}

// ─── Helpers ───────────────────────────────────────────────────────────────

let uid = 0
const rand = (min: number, max: number) => min + Math.random() * (max - min)

function spawnBurst(x: number, y: number): Burst {
  const count = Math.round(rand(MIN_PARTICLES, MAX_PARTICLES))

  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle    = rand(0, 2 * Math.PI)
    const distance = rand(MIN_DISTANCE, MAX_DISTANCE)

    return {
      id:       uid++,
      tx:       Math.cos(angle) * distance,
      ty:       Math.sin(angle) * distance,
      size:     rand(MIN_SIZE, MAX_SIZE),
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: Math.round(rand(MIN_DURATION, MAX_DURATION)),
      rotation: rand(-200, 200),
    }
  })

  return { id: uid++, x, y, particles }
}

// 4-pointed star / sparkle path
const STAR_PATH =
  "M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z"

// ─── Component ─────────────────────────────────────────────────────────────

export function ClickStarEffect() {
  const [bursts, setBursts] = useState<Burst[]>([])
  const pendingTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const handleClick = useCallback((e: MouseEvent) => {
    const burst = spawnBurst(e.clientX, e.clientY)

    setBursts(prev => {
      const next = [...prev, burst]
      // Drop oldest burst if over the cap to keep DOM lean
      return next.length > MAX_BURSTS ? next.slice(next.length - MAX_BURSTS) : next
    })

    // Remove burst from state after animation finishes (max duration + small buffer)
    const t = setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== burst.id))
      pendingTimers.current.delete(t)
    }, MAX_DURATION + 50)

    pendingTimers.current.add(t)
  }, [])

  useEffect(() => {
    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("click", handleClick)
      pendingTimers.current.forEach(clearTimeout)
    }
  }, [handleClick])

  return (
    <div
      aria-hidden="true"
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        9999,
        pointerEvents: "none",
        overflow:      "hidden",
      }}
    >
      {bursts.map(burst =>
        burst.particles.map(p => (
          <div
            key={p.id}
            style={
              {
                position: "absolute",
                // Centre the particle on the click point
                left:  burst.x - p.size / 2,
                top:   burst.y - p.size / 2,
                width:  p.size,
                height: p.size,
                color: p.color,
                // CSS custom properties read by @keyframes click-star-fly
                "--star-tx":  `${p.tx}px`,
                "--star-ty":  `${p.ty}px`,
                "--star-rot": `${p.rotation}deg`,
                animation: `click-star-fly ${p.duration}ms ease-out forwards`,
                // Soft glow using drop-shadow (works on SVG fill)
                filter: `drop-shadow(0 0 ${Math.round(p.size * 0.45)}px ${p.color})`,
              } as React.CSSProperties
            }
          >
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d={STAR_PATH} />
            </svg>
          </div>
        ))
      )}
    </div>
  )
}
