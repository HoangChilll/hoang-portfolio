import { backgroundConfig } from "@/config/background"

/**
 * Full-screen fixed background image, rendered once in the root layout.
 * To change the background site-wide, only edit /config/background.ts.
 *
 * Layer order (bottom → top):
 *   1. Image layer  — applies backgroundImageUrl + opacity + optional blur
 *   2. Overlay layer — applies overlayColor for contrast/readability
 */
export function Background() {
  const {
    backgroundImageUrl,
    opacity,
    blur = 0,
    overlayColor,
  } = backgroundConfig

  return (
    <div
      aria-hidden="true"
      // Fixed so it stays put during scroll; -z-10 keeps it behind all content;
      // pointer-events-none ensures clicks pass through to the page.
      className="pointer-events-none fixed inset-0 -z-10"
    >
      {/* Image layer — opacity and blur are isolated here so the overlay is unaffected */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity,
          // Scale up slightly when blurring to prevent transparent edge artefacts
          ...(blur > 0
            ? { filter: `blur(${blur}px)`, transform: "scale(1.05)" }
            : {}),
        }}
      />

      {/* Overlay layer — rendered at full opacity independently of the image */}
      {overlayColor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: overlayColor,
          }}
        />
      )}
    </div>
  )
}
