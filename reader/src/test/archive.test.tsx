import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useArticleState } from '../hooks/useArticleState'
import { SAMPLE_ARTICLES } from '../lib/sample-data'

describe('Archive integration', () => {
  it('archiving an article removes it from both view tabs', () => {
    const { result } = renderHook(() => useArticleState())
    const firstId = SAMPLE_ARTICLES[0].id

    act(() => result.current.archiveArticle(firstId))

    // Unread tab
    expect(result.current.filteredArticles).toHaveLength(4)

    // All tab
    act(() => result.current.setActiveViewTab("All"))
    expect(result.current.filteredArticles).toHaveLength(4)
  })

  it('archiving reduces unread count', () => {
    const { result } = renderHook(() => useArticleState())
    const firstId = SAMPLE_ARTICLES[0].id

    act(() => result.current.archiveArticle(firstId))
    expect(result.current.unreadCount).toBe(4)
  })
})
