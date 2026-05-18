import { remark } from "remark"
import remarkHtml from "remark-html"

export type Heading = { level: number; text: string; id: string }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const regex = /^(#{1,3})\s+(.+)$/gm
  let match
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    headings.push({ level, text, id: slugify(text) })
  }
  return headings
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(markdown)

  // Inject id into h1-h3 tags so TOC anchor links work
  const html = result.toString().replace(
    /<(h[1-3])>([^<]*(?:<[^>]+>[^<]*<\/[^>]+>[^<]*)*)<\/h[1-3]>/g,
    (_, tag, inner) => {
      const text = inner.replace(/<[^>]+>/g, "")
      return `<${tag} id="${slugify(text)}">${inner}</${tag}>`
    }
  )

  return html
}
