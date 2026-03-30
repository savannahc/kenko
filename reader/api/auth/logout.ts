import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function GET(_req: VercelRequest, res: VercelResponse) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000'

  res.setHeader('Set-Cookie', [
    'access_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0',
    'refresh_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0',
  ])

  res.redirect(302, appUrl)
}
