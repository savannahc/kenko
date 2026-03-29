import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useArticleState } from '../hooks/useArticleState'
import { SAMPLE_ARTICLES } from '../lib/sample-data'

describe('useArticleState', () => {
  it('starts with all articles unread and unarchived', () => {
    const { result } = renderHook(() => useArticleState())
    expect(result.current.filteredArticles).toHaveLength(5)
    expect(result.current.unreadCount).toBe(5)
    expect(result.current.activeViewTab).toBe("Unread")
  })

  it('marking an article as read removes it from Unread view', () => {
    const { result } = renderHook(() => useArticleState())
    const firstId = SAMPLE_ARTICLES[0].id
    act(() => result.current.toggleRead(firstId, true))
    expect(result.current.filteredArticles).toHaveLength(4)
    expect(result.current.unreadCount).toBe(4)
    expect(result.current.isRead(firstId)).toBe(true)
  })

  it('marking an article as read keeps it visible in All view', () => {
    const { result } = renderHook(() => useArticleState())
    const firstId = SAMPLE_ARTICLES[0].id
    act(() => result.current.toggleRead(firstId, true))
    act(() => result.current.setActiveViewTab("All"))
    expect(result.current.filteredArticles).toHaveLength(5)
  })

  it('toggling read back to false restores it in Unread view', () => {
    const { result } = renderHook(() => useArticleState())
    const firstId = SAMPLE_ARTICLES[0].id
    act(() => result.current.toggleRead(firstId, true))
    expect(result.current.filteredArticles).toHaveLength(4)
    act(() => result.current.toggleRead(firstId, false))
    expect(result.current.filteredArticles).toHaveLength(5)
    expect(result.current.unreadCount).toBe(5)
  })

  it('archiving removes article from both Unread and All views', () => {
    const { result } = renderHook(() => useArticleState())
    const firstId = SAMPLE_ARTICLES[0].id
    act(() => result.current.archiveArticle(firstId))
    expect(result.current.filteredArticles).toHaveLength(4)
    expect(result.current.unreadCount).toBe(4)
    act(() => result.current.setActiveViewTab("All"))
    expect(result.current.filteredArticles).toHaveLength(4)
  })

  it('category filter works within the active view tab', () => {
    const { result } = renderHook(() => useArticleState())
    const techCount = SAMPLE_ARTICLES.filter(a => a.category === "Tech").length
    act(() => result.current.setActiveCategory("Tech"))
    expect(result.current.filteredArticles).toHaveLength(techCount)
  })

  it('category filter + view tab combine correctly', () => {
    const { result } = renderHook(() => useArticleState())
    // Mark the Tech article as read
    const techArticle = SAMPLE_ARTICLES.find(a => a.category === "Tech")!
    act(() => result.current.toggleRead(techArticle.id, true))
    // On Unread tab filtered to Tech, should be 0
    act(() => result.current.setActiveCategory("Tech"))
    expect(result.current.filteredArticles).toHaveLength(0)
    // On All tab filtered to Tech, should be 1
    act(() => result.current.setActiveViewTab("All"))
    expect(result.current.filteredArticles).toHaveLength(1)
  })

  it('selectArticle sets and clears the selected article', () => {
    const { result } = renderHook(() => useArticleState())
    expect(result.current.selectedArticle).toBeNull()
    act(() => result.current.selectArticle(SAMPLE_ARTICLES[0]))
    expect(result.current.selectedArticle).toEqual(SAMPLE_ARTICLES[0])
    act(() => result.current.selectArticle(null))
    expect(result.current.selectedArticle).toBeNull()
  })
})
