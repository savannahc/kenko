import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function GET(req: VercelRequest, res: VercelResponse) {
  const code = req.query.code as string
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const redirectUri = `${appUrl}/api/auth/callback`

  if (!code) {
    res.status(400).json({ error: 'Missing authorization code' })
    return
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    const error = await tokenRes.text()
    res.status(401).json({ error: 'Token exchange failed', details: error })
    return
  }

  const tokens = await tokenRes.json()
  const isSecure = appUrl.startsWith('https')

  // access_token: 1 hour expiry
  res.setHeader('Set-Cookie', [
    `access_token=${tokens.access_token}; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=3600`,
    `refresh_token=${tokens.refresh_token}; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`,
  ])

  res.redirect(302, appUrl)
}
