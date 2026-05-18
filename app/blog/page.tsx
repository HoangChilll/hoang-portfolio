import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software development, tools, and the web.",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-base text-muted-foreground">
          Thoughts on software development, tools, and the web.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-card-hover"
            >
              <div className="flex-1">
                <h2 className="mb-2 font-semibold leading-snug group-hover:underline underline-offset-4">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {post.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
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
      )}
    </div>
  )
}
