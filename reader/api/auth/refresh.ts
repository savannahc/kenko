import type { VercelRequest, VercelResponse } from '@vercel/node'

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  cookieHeader.split(';').forEach(pair => {
    const [key, ...rest] = pair.trim().split('=')
    if (key) cookies[key] = rest.join('=')
  })
  return cookies
}

export default async function POST(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req.headers.cookie || '')
  const refreshToken = cookies.refresh_token

  if (!refreshToken) {
    res.status(401).json({ error: 'No refresh token' })
    return
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
    }),
  })

  if (!tokenRes.ok) {
    res.status(401).json({ error: 'Token refresh failed' })
    return
  }

  const tokens = await tokenRes.json()
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const isSecure = appUrl.startsWith('https')

  res.setHeader('Set-Cookie', [
    `access_token=${tokens.access_token}; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=3600`,
  ])

  res.json({ success: true })
}
