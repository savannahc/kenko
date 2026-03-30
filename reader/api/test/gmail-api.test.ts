import { describe, it, expect, vi } from 'vitest'

// These tests verify the API module structure and URL construction,
// not actual Gmail calls (those need real credentials)

describe('Gmail API backend structure', () => {
  it('auth/google.ts exists and exports a handler', async () => {
    const mod = await import('../auth/google')
    expect(mod.default || mod.GET).toBeDefined()
  })

  it('auth/callback.ts exists and exports a handler', async () => {
    const mod = await import('../auth/callback')
    expect(mod.default || mod.GET).toBeDefined()
  })

  it('auth/refresh.ts exists and exports a handler', async () => {
    const mod = await import('../auth/refresh')
    expect(mod.default || mod.POST || mod.GET).toBeDefined()
  })

  it('auth/status.ts exists and exports a handler', async () => {
    const mod = await import('../auth/status')
    expect(mod.default || mod.GET).toBeDefined()
  })

  it('articles.ts exists and exports a handler', async () => {
    const mod = await import('../articles')
    expect(mod.default || mod.GET).toBeDefined()
  })

  it('archive.ts exists and exports a handler', async () => {
    const mod = await import('../archive')
    expect(mod.default || mod.POST).toBeDefined()
  })

  it('lib/gmail.ts exports required helper functions', async () => {
    const mod = await import('../lib/gmail')
    expect(mod.getMessages).toBeDefined()
    expect(mod.getMessage).toBeDefined()
    expect(mod.archiveMessage).toBeDefined()
  })
})

describe('Gmail URL construction', () => {
  it('getMessages constructs correct Gmail API URL', async () => {
    const mod = await import('../lib/gmail')

    // Mock fetch to capture the URL
    const originalFetch = globalThis.fetch
    let capturedUrl = ''
    globalThis.fetch = vi.fn(async (url: any) => {
      capturedUrl = url.toString()
      return new Response(JSON.stringify({ messages: [] }), { status: 200 })
    }) as any

    try {
      await mod.getMessages('fake-token', 'to read')
      expect(capturedUrl).toContain('gmail.googleapis.com')
      expect(capturedUrl).toContain('messages')
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
