export interface Article {
  id: string
  source: string
  author: string
  date: string
  receivedAt: string
  readTime: string
  category: string
  title: string
  summary: string
  content: string[]
  gmailMessageId: string
  heroColor: string
  accentColor: string
}

export type ViewTab = "Unread" | "All"

export type Category = "All" | "Tech" | "Finance" | "Strategy" | "Culture" | "Policy"

export const CATEGORIES: Category[] = ["All", "Tech", "Finance", "Strategy", "Culture", "Policy"]
