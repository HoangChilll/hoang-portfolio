import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/data/site"

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Docker",
  "Git",
]

export function AboutPreview() {
  return (
    <section className="py-24 bg-muted/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">About Me</h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              {siteConfig.bio}
            </p>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">
              I focus on writing clean, maintainable code and building products
              that are both fast and accessible. I&apos;m always learning new
              technologies and enjoy contributing to the developer community.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              More about me
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
