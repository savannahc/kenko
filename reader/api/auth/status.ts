import type { VercelRequest, VercelResponse } from '@vercel/node'

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  cookieHeader.split(';').forEach(pair => {
    const [key, ...rest] = pair.trim().split('=')
    if (key) cookies[key] = rest.join('=')
  })
  return cookies
}

export default function GET(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req.headers.cookie || '')
  const authenticated = Boolean(cookies.access_token || cookies.refresh_token)
  res.json({ authenticated })
}
