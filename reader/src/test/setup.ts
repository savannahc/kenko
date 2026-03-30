import '@testing-library/jest-dom'

// Skip AuthGate in tests so components render immediately
sessionStorage.setItem('reader-auth-skipped', 'true')

// Mock fetch to return unauthenticated by default (no API server in tests)
const originalFetch = globalThis.fetch
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  if (url.includes('/api/auth/status')) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 200 })
  }
  return originalFetch(input, init)
}
