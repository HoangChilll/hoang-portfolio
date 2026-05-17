import { achievements } from "@/data/achievements"

const typeLabel: Record<string, string> = {
  award: "Award",
  certification: "Cert",
  competition: "Competition",
  other: "Achievement",
}

export function Achievements() {
  return (
    <section className="py-24 bg-muted/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-2xl font-bold tracking-tight">
          Achievements
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover dark:shadow-none dark:border dark:border-border"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {typeLabel[item.type]}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.year}
                </span>
              </div>
              <h3 className="mb-2 font-semibold leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
