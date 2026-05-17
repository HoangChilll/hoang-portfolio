import Link from "next/link"
import { siteConfig } from "@/data/site"
import { ThemeToggle } from "./theme-toggle"

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight hover:opacity-70 transition-opacity"
        >
          {siteConfig.name}
          <span className="text-muted-foreground">.</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
