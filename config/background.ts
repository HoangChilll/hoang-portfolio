export const backgroundConfig = {
  backgroundImageUrl: "/images/aa.jpg",
  opacity: 0.35,
  blur: 0,
  overlayColor: "rgba(0,0,0,0.25)",
} satisfies BackgroundConfig

export interface BackgroundConfig {
  /** Local path (e.g. "/bg.jpg") or any external URL (e.g. "https://...") */
  backgroundImageUrl: string
  /** 0 = fully transparent, 1 = fully opaque */
  opacity: number
  /** Blur radius in px. 0 = no blur */
  blur?: number
  /** CSS color string for the overlay, e.g. "rgba(0,0,0,0.5)" */
  overlayColor?: string
}
