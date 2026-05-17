import Link from "next/link"
import { Mail } from "lucide-react"
import { GithubIcon } from "@/components/icons/github"
import { siteConfig } from "@/data/site"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
