import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"
import { GithubIcon } from "@/components/icons/github"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/data/site"

export function Hero() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 font-mono text-sm text-muted-foreground">
            Hello, I&apos;m
          </p>

          <h1 className="mb-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {siteConfig.fullName}
          </h1>

          <h2 className="mb-6 text-xl font-medium text-muted-foreground sm:text-2xl">
            {siteConfig.role}{" "}
            <span className="text-foreground/40">—</span>{" "}
            {siteConfig.location}
          </h2>

          <p className="mb-10 max-w-lg text-base leading-relaxed text-muted-foreground">
            {siteConfig.bio}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="px-5 h-10">
              <Link href="/projects">
                View Projects
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-5 h-10">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="mr-1.5 size-4" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="px-5 h-10">
              <a href={`mailto:${siteConfig.email}`}>
                <Mail className="mr-1.5 size-4" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
