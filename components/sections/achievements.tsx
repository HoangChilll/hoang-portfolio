import Link from "next/link"
import { achievements } from "@/data/achievements"

const typeLabel: Record<string, string> = {
  award: "Học bổng",
  certification: "Cert",
  competition: "Competition",
  other: "Achievement",
}

export function Achievements() {
  return (
    <section id="achievements" className="py-24 bg-muted/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-2xl font-bold tracking-tight">
          Achievements
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => (
            <Link
              key={item.id}
              href={`/achievements/${item.slug}`}
              className="group rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover dark:shadow-none dark:border dark:border-border"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {typeLabel[item.type]}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.year}
                </span>
              </div>
              <h3 className="mb-2 font-semibold leading-snug group-hover:underline underline-offset-4">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
