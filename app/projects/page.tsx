import type { Metadata } from "next"
import { ExternalLink } from "lucide-react"
import { GithubIcon } from "@/components/icons/github"
import { projects } from "@/data/projects"
import type { Project } from "@/types/project"

export const metadata: Metadata = {
  title: "Projects",
  description: "A showcase of my projects and work.",
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-base text-muted-foreground">
          Things I&apos;ve built — personal projects, open source, and experiments.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover dark:shadow-none dark:border dark:border-border">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="font-semibold leading-snug">{project.title}</h2>
        <div className="flex shrink-0 gap-2 pt-0.5">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="size-4" />
            </a>
          )}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Live demo"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
