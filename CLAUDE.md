@AGENTS.md
# Project Instructions

This is a personal portfolio + blog website.

## Tech Stack
- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- MDX or Markdown for blog

---

## Core Rules

Always follow these skills:
- .claude/skills/design.md
- .claude/skills/styling.md

---

## UI/UX Principles

- Build modern SaaS-style UI (Vercel / Linear level)
- Mobile-first responsive design
- Keep UI minimal, clean, high readability
- Use reusable components only
- Avoid unnecessary complexity

---

## Pages Structure

- Home (Hero + About + Projects + Achievements + Blog preview)
- Projects (full project list)
- Blog (MDX posts with tags)
- About (personal info + skills)

---

## Content Rules

- No hardcoded content inside components
- Blog posts stored in /content/posts
- Each post must have:
  - title
  - date
  - tags
  - slug

---

## Design Rules Priority

1. design.md (visual system)
2. styling.md (implementation rules)
3. security.md (safe coding rules)

---

## Code Rules

- Use App Router structure
- Prefer server components when possible
- Separate UI / logic / data
- No duplicated components
- Keep code modular and readable

---

## SEO Rules

- Every page must have metadata
- Use OpenGraph tags
- Optimize images using next/image
- Ensure fast load performance

---

## Output Expectation

AI should always generate:
- Production-ready UI
- Clean folder structure
- Reusable components
- Responsive layout
## Security

Always follow:
- .claude/skills/rules/security.md