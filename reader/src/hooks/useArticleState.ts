import { useState, useMemo, useCallback } from 'react'
import type { Article, ViewTab, Category } from '../types/article'
import { SAMPLE_ARTICLES } from '../lib/sample-data'

export function useArticleState() {
  const [articles] = useState<Article[]>(SAMPLE_ARTICLES)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set())
  const [activeViewTab, setActiveViewTab] = useState<ViewTab>('Unread')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [selectedArticle, selectArticle] = useState<Article | null>(null)

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      if (archivedIds.has(a.id)) return false
      if (activeViewTab === 'Unread' && readIds.has(a.id)) return false
      if (activeCategory !== 'All' && a.category !== activeCategory) return false
      return true
    })
  }, [articles, archivedIds, readIds, activeViewTab, activeCategory])

  const unreadCount = useMemo(() => {
    return articles.filter(a => !archivedIds.has(a.id) && !readIds.has(a.id)).length
  }, [articles, archivedIds, readIds])

  const isRead = useCallback((id: string) => readIds.has(id), [readIds])

  const toggleRead = useCallback((id: string, read: boolean) => {
    setReadIds(prev => {
      const next = new Set(prev)
      if (read) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const archiveArticle = useCallback((id: string) => {
    setArchivedIds(prev => new Set(prev).add(id))
  }, [])

  return {
    filteredArticles,
    unreadCount,
    isRead,
    toggleRead,
    archiveArticle,
    activeViewTab,
    setActiveViewTab,
    activeCategory,
    setActiveCategory,
    selectedArticle,
    selectArticle,
  }
}
