import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function GET(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const redirectUri = `${appUrl}/api/auth/callback`

  const params = new URLSearchParams({
    client_id: clientId || '',
    redirect_uri: redirectUri,
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  })

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  res.redirect(302, url)
}
