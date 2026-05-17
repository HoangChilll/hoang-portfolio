import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { GithubIcon } from "@/components/icons/github"
import { siteConfig } from "@/data/site"
import { achievements } from "@/data/achievements"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about who I am and what I do.",
}

// ─── Edit your skills here ───────────────────────────────────────────────────
const skillGroups = [
  {
    label: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "PostgreSQL", "Docker", "FastAPI"],
  },
  {
    label: "Tools",
    skills: ["Git", "GitHub", "Figma", "VS Code"],
  },
]

// ─── Edit your experience / timeline here ───────────────────────────────────
const timeline = [
  {
    year: "2026",
    title: "Building & Learning",
    description:
      "Focused on full-stack development, contributing to open source and personal projects.",
  },
  {
    year: "2025",
    title: "First Freelance Projects",
    description:
      "Delivered web applications for clients, sharpened skills in React and Node.js.",
  },
  {
    year: "2024",
    title: "Started Coding Seriously",
    description:
      "Deep-dived into software development, built first projects and joined hackathons.",
  },
]

const typeLabel: Record<string, string> = {
  award: "Award",
  certification: "Cert",
  competition: "Competition",
  other: "Achievement",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">

      {/* ── Hero ── */}
      <div className="mb-16">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">About Me</h1>
        <p className="mb-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {siteConfig.bio}
        </p>
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          I focus on writing clean, maintainable code and building products that
          are both fast and accessible. I&apos;m always learning new technologies
          and enjoy contributing to the developer community.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium shadow-card hover:shadow-card-hover transition-shadow dark:border dark:border-border dark:shadow-none"
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium shadow-card hover:shadow-card-hover transition-shadow dark:border dark:border-border dark:shadow-none"
          >
            <Mail className="size-4" />
            {siteConfig.email}
          </a>
        </div>
      </div>

      {/* ── Skills ── */}
      <div className="mb-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Skills</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className="rounded-xl bg-card p-5 shadow-card dark:shadow-none dark:border dark:border-border"
            >
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-muted px-2.5 py-1 text-sm text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="mb-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Timeline</h2>
        <div className="space-y-0">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-6 pb-8">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card shadow-card text-xs font-mono font-semibold dark:border dark:border-border dark:shadow-none">
                  {item.year.slice(2)}
                </span>
                {i < timeline.length - 1 && (
                  <div className="mt-2 w-px flex-1 bg-border" />
                )}
              </div>
              <div className="pb-2 pt-1">
                <p className="mb-1 font-semibold">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Achievements ── */}
      <div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Achievements</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-card p-5 shadow-card dark:shadow-none dark:border dark:border-border"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {typeLabel[item.type]}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.year}
                </span>
              </div>
              <h3 className="mb-1.5 font-semibold leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
