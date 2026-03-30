import type { VercelRequest, VercelResponse } from '@vercel/node'
import { archiveMessage } from './lib/gmail'

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
  const accessToken = cookies.access_token

  if (!accessToken) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  const { messageId, labelId } = req.body || {}

  if (!messageId || !labelId) {
    res.status(400).json({ error: 'Missing messageId or labelId' })
    return
  }

  try {
    await archiveMessage(accessToken, messageId, labelId)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive', details: String(error) })
  }
}
