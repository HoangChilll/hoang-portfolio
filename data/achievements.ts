export interface Achievement {
  id: string
  title: string
  year: string
  description: string
  type: "award" | "certification" | "competition" | "other"
}

export const achievements: Achievement[] = [
  {
    id: "1",
    title: "First Place — Hackathon",
    year: "2024",
    description: "Won first place in a regional hackathon, building a full-stack app in 24 hours.",
    type: "competition",
  },
  {
    id: "2",
    title: "Open Source Contributor",
    year: "2024",
    description: "Contributed meaningful improvements to open-source projects used by thousands of developers.",
    type: "other",
  },
  {
    id: "3",
    title: "AWS Cloud Practitioner",
    year: "2023",
    description: "Earned the AWS Certified Cloud Practitioner certification.",
    type: "certification",
  },
]
