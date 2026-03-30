import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkAuthStatus, fetchArticles } from '../lib/api'

describe('API client', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('checkAuthStatus returns authenticated false when API is unavailable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
    const result = await checkAuthStatus()
    expect(result.authenticated).toBe(false)
  })

  it('checkAuthStatus parses successful response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ authenticated: true }), { status: 200 })
    )
    const result = await checkAuthStatus()
    expect(result.authenticated).toBe(true)
  })

  it('fetchArticles returns empty array on failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
    const result = await fetchArticles()
    expect(result).toEqual([])
  })

  it('fetchArticles parses article array', async () => {
    const mockArticles = [{ id: '1', title: 'Test', source: 'Test' }]
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockArticles), { status: 200 })
    )
    const result = await fetchArticles()
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Test')
  })
})
