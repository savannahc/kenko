import type { Article } from '../types/article'

export async function checkAuthStatus(): Promise<{ authenticated: boolean }> {
  try {
    const res = await fetch('/api/auth/status')
    if (!res.ok) return { authenticated: false }
    return res.json()
  } catch {
    return { authenticated: false }
  }
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch('/api/articles')
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function archiveArticle(messageId: string, labelId: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch('/api/archive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, labelId }),
    })
    if (!res.ok) return { success: false }
    return res.json()
  } catch {
    return { success: false }
  }
}

export function getLoginUrl(): string {
  return '/api/auth/google'
}

export async function logout(): Promise<void> {
  window.location.href = '/api/auth/logout'
}
