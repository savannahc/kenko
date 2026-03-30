import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

const TRACKING_DOMAINS = [
  'track', 'pixel', 'open.substack.com', 'click.', 'beacon',
  'mailchimp.com/track', 'list-manage.com/track', 'convertkit',
]

const BOILERPLATE_PATTERNS = [
  /unsubscribe/i,
  /manage\s+(your\s+)?preferences/i,
  /forward\s+this/i,
  /view\s+(this\s+)?(email\s+)?in\s+(your\s+)?browser/i,
  /sent\s+to\s+you\s+because/i,
  /all\s+rights\s+reserved/i,
  /update\s+your\s+preferences/i,
  /email\s+preferences/i,
  /powered\s+by/i,
  /©\s*\d{4}/,
]

function preCleanHtml(html: string): string {
  // Remove style and script tags with contents
  let cleaned = html.replace(/<style[\s\S]*?<\/style>/gi, '')
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '')

  // Remove tracking pixels
  cleaned = cleaned.replace(/<img[^>]*>/gi, (match) => {
    const widthMatch = match.match(/width\s*=\s*["']?1["']?/i)
    const heightMatch = match.match(/height\s*=\s*["']?1["']?/i)
    if (widthMatch || heightMatch) return ''

    const srcMatch = match.match(/src\s*=\s*["']([^"']*)["']/i)
    if (srcMatch) {
      const src = srcMatch[1].toLowerCase()
      if (TRACKING_DOMAINS.some(d => src.includes(d))) return ''
    }
    return match
  })

  return cleaned
}

function removeBoilerplateElements(doc: Document): void {
  const allElements = doc.querySelectorAll('div, p, span, td, tr, table, footer, section')
  allElements.forEach(el => {
    const text = el.textContent || ''
    // Remove unsubscribe sections
    if (/unsubscribe|manage\s+preferences/i.test(text) && text.length < 500) {
      el.remove()
      return
    }
    // Remove social sharing rows (multiple small images)
    const imgs = el.querySelectorAll('img')
    if (imgs.length >= 3) {
      const allSmall = Array.from(imgs).every(img => {
        const w = parseInt(img.getAttribute('width') || '999')
        const h = parseInt(img.getAttribute('height') || '999')
        return (w <= 32 && h <= 32)
      })
      if (allSmall) {
        el.remove()
      }
    }
  })
}

function isBoilerplate(text: string): boolean {
  return BOILERPLATE_PATTERNS.some(p => p.test(text))
}

function processIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map(p => p.replace(/\s+/g, ' ').trim())
    .filter(p => p.length >= 30)
    .filter(p => !isBoilerplate(p))
}

function generateSummary(paragraphs: string[]): string {
  if (paragraphs.length === 0) return ''
  const first = paragraphs[0]
  if (first.length <= 200) return first
  const truncated = first.slice(0, 200)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + '...'
}

function calculateReadTime(paragraphs: string[]): string {
  const totalWords = paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0)
  const minutes = Math.max(1, Math.ceil(totalWords / 230))
  return `${minutes} min`
}

export function extractContent(html: string): { paragraphs: string[]; summary: string; readTime: string } {
  const cleaned = preCleanHtml(html)

  // Try Readability
  let paragraphs: string[] = []
  try {
    const dom = new JSDOM(cleaned, { url: 'https://example.com' })
    removeBoilerplateElements(dom.window.document)
    const reader = new Readability(dom.window.document)
    const article = reader.parse()
    if (article && article.content && article.textContent && article.textContent.length >= 100) {
      // Split Readability's HTML output on <p> tags to preserve paragraph structure
      const contentDom = new JSDOM(article.content)
      const pElements = contentDom.window.document.querySelectorAll('p')
      if (pElements.length > 0) {
        paragraphs = Array.from(pElements)
          .map(el => (el.textContent || '').replace(/\s+/g, ' ').trim())
          .filter(p => p.length >= 30)
          .filter(p => !isBoilerplate(p))
      } else {
        // No <p> tags — fall back to double-newline split on textContent
        paragraphs = processIntoParagraphs(article.textContent)
      }
    }
  } catch {
    // Readability failed, fall through
  }

  // Fallback: strip HTML tags
  if (paragraphs.length === 0) {
    let text: string
    // For plain text (no HTML tags), use the raw input
    if (!/<[a-z][\s\S]*>/i.test(html)) {
      text = html
    } else {
      text = cleaned
        .replace(/<[^>]+>/g, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
    }
    paragraphs = processIntoParagraphs(text)
  }
  const summary = generateSummary(paragraphs)
  const readTime = calculateReadTime(paragraphs)

  return { paragraphs, summary, readTime }
}

const KNOWN_COLORS: Record<string, { heroColor: string; accentColor: string }> = {
  'Platformer': { heroColor: '#1a1a2e', accentColor: '#e94560' },
  'Money Stuff': { heroColor: '#0a0a0a', accentColor: '#00d4aa' },
  'Stratechery': { heroColor: '#16213e', accentColor: '#f8b500' },
  'Garbage Day': { heroColor: '#2d1b4e', accentColor: '#ff6b9d' },
  'Slow Boring': { heroColor: '#1b2d1b', accentColor: '#7fcd91' },
  'The Verge': { heroColor: '#1a0a2e', accentColor: '#e040fb' },
  'Axios': { heroColor: '#0d1b2a', accentColor: '#00b4d8' },
  'Morning Brew': { heroColor: '#1b1a0a', accentColor: '#f4a261' },
  'The Hustle': { heroColor: '#0a1a1a', accentColor: '#2ec4b6' },
  'Benedict Evans': { heroColor: '#1e1e2e', accentColor: '#c084fc' },
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash)
}

export function assignArticleColors(source: string): { heroColor: string; accentColor: string } {
  if (KNOWN_COLORS[source]) {
    return KNOWN_COLORS[source]
  }

  const hash = hashString(source)

  // Dark heroColor: each channel between 10-45
  const r = 10 + (hash % 35)
  const g = 10 + ((hash >> 8) % 35)
  const b = 10 + ((hash >> 16) % 35)
  const heroColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

  // Vivid accentColor: one high channel, moderate others
  const hue = hash % 360
  const hi = Math.floor(hue / 60) % 6
  const f = (hue / 60) - Math.floor(hue / 60)
  const q = Math.round(255 * (1 - f))
  const t = Math.round(255 * f)
  let ar: number, ag: number, ab: number
  switch (hi) {
    case 0: ar = 255; ag = t; ab = 60; break
    case 1: ar = q; ag = 255; ab = 60; break
    case 2: ar = 60; ag = 255; ab = t; break
    case 3: ar = 60; ag = q; ab = 255; break
    case 4: ar = t; ag = 60; ab = 255; break
    default: ar = 255; ag = 60; ab = q; break
  }
  const accentColor = `#${ar.toString(16).padStart(2, '0')}${ag.toString(16).padStart(2, '0')}${ab.toString(16).padStart(2, '0')}`

  return { heroColor, accentColor }
}
