import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getMessages, getMessage } from './lib/gmail'
import { extractContent, assignArticleColors } from './lib/extract-content'

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  cookieHeader.split(';').forEach(pair => {
    const [key, ...rest] = pair.trim().split('=')
    if (key) cookies[key] = rest.join('=')
  })
  return cookies
}

function getHeader(headers: Array<{ name: string; value: string }>, name: string): string {
  const header = headers.find((h: { name: string }) => h.name.toLowerCase() === name.toLowerCase())
  return header?.value || ''
}

function parseFrom(from: string): { source: string; author: string } {
  const match = from.match(/^"?(.+?)"?\s*</)
  if (match) {
    return { source: match[1].trim(), author: match[1].trim() }
  }
  return { source: from, author: from }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function extractHtmlBody(payload: any): string {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64url').toString('utf-8')
  }
  if (payload.parts) {
    // Prefer HTML
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64url').toString('utf-8')
      }
    }
    // Fall back to plain text
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64url').toString('utf-8')
      }
    }
    // Recurse into nested parts
    for (const part of payload.parts) {
      const nested = extractHtmlBody(part)
      if (nested) return nested
    }
  }
  return ''
}

export default async function GET(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req.headers.cookie || '')
  const accessToken = cookies.access_token

  if (!accessToken) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  const labelName = process.env.GMAIL_LABEL || 'to read'

  try {
    const messageList = await getMessages(accessToken, labelName)
    const articles = await Promise.all(
      messageList.map(async (msg: { id: string }) => {
        const full = await getMessage(accessToken, msg.id)
        const headers = full.payload?.headers || []
        const subject = getHeader(headers, 'Subject')
        const from = getHeader(headers, 'From')
        const date = getHeader(headers, 'Date')
        const { source, author } = parseFrom(from)
        const body = extractHtmlBody(full.payload)
        const { paragraphs, summary, readTime } = extractContent(body)
        const { heroColor, accentColor } = assignArticleColors(source)

        return {
          id: msg.id,
          source,
          author,
          date: formatDate(date),
          receivedAt: new Date(date).toISOString(),
          readTime,
          category: 'Uncategorized',
          title: subject,
          summary,
          content: paragraphs,
          gmailMessageId: msg.id,
          heroColor,
          accentColor,
        }
      })
    )

    articles.sort((a: { receivedAt: string }, b: { receivedAt: string }) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    )

    res.json(articles)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles', details: String(error) })
  }
}
