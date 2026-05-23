import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { achievements, getAchievementBySlug } from "@/data/achievements"
import { BlogLayout } from "@/components/blog/blog-layout"

export function generateStaticParams() {
  return achievements.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getAchievementBySlug(slug)
  if (!item) return {}
  return { title: item.title, description: item.description }
}

const typeLabel: Record<string, string> = {
  award: "Học bổng",
  certification: "Cert",
  competition: "Competition",
  other: "Achievement",
}

export default async function AchievementPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getAchievementBySlug(slug)
  if (!item) notFound()

  return (
    <BlogLayout>
      <Link
        href="/#achievements"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        All achievements
      </Link>

      <article>
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {typeLabel[item.type]}
            </span>
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">{item.title}</h1>
          <p className="mb-4 text-lg text-muted-foreground">{item.description}</p>
          <span className="font-mono text-sm text-muted-foreground">{item.year}</span>
        </header>

        <hr className="mb-10 border-border" />

        {item.image && (
          <div className="relative w-full overflow-hidden rounded-xl border border-border">
            <Image
              src={item.image}
              alt={item.title}
              width={900}
              height={600}
              className="w-full object-contain"
            />
          </div>
        )}

        {item.content && (
          <div
            className="prose mt-10"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        )}
      </article>
    </BlogLayout>
  )
}
