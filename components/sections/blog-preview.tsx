import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getRecentPosts } from "@/lib/blog"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function BlogPreview() {
  const posts = getRecentPosts(3)

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            All posts
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-card-hover"
            >
              <div className="flex-1">
                <h3 className="mb-2 font-medium leading-snug group-hover:underline underline-offset-4">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <time
                dateTime={post.date}
                className="font-mono text-xs text-muted-foreground"
              >
                {formatDate(post.date)}
              </time>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
