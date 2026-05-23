export interface Achievement {
  id: string
  slug: string
  title: string
  year: string
  description: string
  type: "award" | "certification" | "competition" | "other"
  image?: string
  content?: string
}

export const achievements: Achievement[] = [
  {
    id: "1",
    slug: "hackathon-first-place",
    title: "First Place — Hackathon",
    year: "2024",
    description: "Won first place in a regional hackathon, building a full-stack app in 24 hours.",
    type: "competition",
  },
  {
    id: "2",
    slug: "open-source-contributor",
    title: "Open Source Contributor",
    year: "2024",
    description: "Contributed meaningful improvements to open-source projects used by thousands of developers.",
    type: "other",
  },
  {
    id: "3",
    slug: "aws-cloud-practitioner",
    title: "AWS Cloud Practitioner",
    year: "2023",
    description: "Earned the AWS Certified Cloud Practitioner certification.",
    type: "certification",
  },
  {
    id: "4",
    slug: "hoc-bong-kkht-2024-2",
    title: "Học bổng KKHT kì 2024.2",
    year: "2024",
    description: "Đạt học bổng Khuyến Khích Học Tập kì 2024.2.",
    type: "award",
    image: "/images/scholarship-kkht.png",
  },
  {
    id: "5",
    slug: "sinhvien-xuat-sac-2024",
    title: "Sinh viên xuất sắc năm học 2024",
    year: "2024",
    description: "Đạt danh hiệu sinh viên có thành tích học tập và rèn luyện xuất sắc năm học 2024.",
    type: "award",
    image: "/images/scholarship-excellent.png",
  },
]

export function getAchievementBySlug(slug: string): Achievement | undefined {
  return achievements.find((a) => a.slug === slug)
}
