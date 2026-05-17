import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "Portfolio Website",
    description:
      "A personal portfolio and blog built with Next.js 16, TypeScript, and Tailwind CSS. Features dark mode, MDX blog system, and project showcase.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    github: "https://github.com/HoangChilll/hoang-portfolio",
    featured: true,
  },
  {
    id: "project-2",
    title: "Web Application",
    description:
      "A full-stack web application with user authentication, real-time features, and a clean RESTful API backend.",
    tags: ["React", "Node.js", "PostgreSQL"],
    featured: true,
  },
  {
    id: "project-3",
    title: "CLI Tooling",
    description:
      "Developer tooling built to automate repetitive workflows. Supports plugins and integrates with popular CI/CD pipelines.",
    tags: ["Python", "FastAPI", "Docker"],
    featured: true,
  },
]

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}
