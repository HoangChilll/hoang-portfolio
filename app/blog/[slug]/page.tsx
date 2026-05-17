import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { markdownToHtml } from "@/lib/markdown"

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const contentHtml = await markdownToHtml(post.content)

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        All posts
      </Link>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">{post.title}</h1>
        {post.description && (
          <p className="mb-4 text-lg text-muted-foreground">{post.description}</p>
        )}
        <time className="font-mono text-sm text-muted-foreground">
          {formatDate(post.date)}
        </time>
      </header>

      <hr className="mb-10 border-border" />

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  )
}
