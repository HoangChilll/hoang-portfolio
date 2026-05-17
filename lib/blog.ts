import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { BlogPost } from "@/types/blog"

const POSTS_DIR = path.join(process.cwd(), "content/posts")

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8")
      const { data } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        date: String(data.date ?? ""),
        tags: Array.isArray(data.tags) ? data.tags : [],
        description: data.description ?? "",
      } satisfies BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getRecentPosts(count = 3): BlogPost[] {
  return getAllPosts().slice(0, count)
}

export function getPostBySlug(
  slug: string
): (BlogPost & { content: string }) | undefined {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined

  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: data.description ?? "",
    content,
  }
}
