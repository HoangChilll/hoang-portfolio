import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { GithubIcon } from "@/components/icons/github"
import { getFeaturedProjects } from "@/data/projects"
import type { Project } from "@/types/project"

export function ProjectsPreview() {
  const projects = getFeaturedProjects()

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover dark:shadow-none dark:border dark:border-border">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{project.title}</h3>
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
