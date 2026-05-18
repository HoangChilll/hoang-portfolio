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

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const allPosts = getAllPosts()
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort()

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-10">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-base text-muted-foreground">
          Thoughts on software development, tools, and the web.
        </p>
      </div>

      <TagFilter allTags={allTags} searchParams={searchParams} allPosts={allPosts} />
    </div>
  )
}

async function TagFilter({
  allTags,
  searchParams,
  allPosts,
}: {
  allTags: string[]
  searchParams: Promise<{ tag?: string }>
  allPosts: ReturnType<typeof getAllPosts>
}) {
  const { tag: activeTag } = await searchParams
  const posts = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts

  return (
    <>
      {/* Tag pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            !activeTag
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </Link>
        {allTags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              activeTag === tag
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts found for this tag.</p>
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
                      className={`rounded-md px-2 py-0.5 text-xs ${
                        activeTag === tag
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
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
    </>
  )
}
