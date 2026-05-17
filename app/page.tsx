import type { Metadata } from "next"
import { Hero } from "@/components/sections/hero"
import { AboutPreview } from "@/components/sections/about-preview"
import { ProjectsPreview } from "@/components/sections/projects-preview"
import { Achievements } from "@/components/sections/achievements"
import { BlogPreview } from "@/components/sections/blog-preview"
import { siteConfig } from "@/data/site"

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ProjectsPreview />
      <Achievements />
      <BlogPreview />
    </>
  )
}
