import { describe, it, expect } from 'vitest'
import { extractContent, assignArticleColors } from '../lib/extract-content'

const SAMPLE_NEWSLETTER_HTML = `
<html>
<head><style>body { font-family: sans-serif; }</style></head>
<img src="https://open.substack.com/track/pixel" width="1" height="1" />
<body>
<div>
<h1>The Future of Remote Work</h1>
<p>Remote work has fundamentally changed how companies operate. The shift that began during the pandemic has become permanent for many organizations, reshaping everything from hiring practices to real estate strategies.</p>
<p>According to recent surveys, over 60% of knowledge workers now prefer a hybrid arrangement, splitting their time between home and office. This preference has proven remarkably sticky even as companies have attempted return-to-office mandates.</p>
<p>The implications for commercial real estate are staggering. Office vacancy rates in major cities remain at historic highs, and many landlords are converting office space to residential or mixed-use developments.</p>
<p>But the picture isn't uniformly rosy. Some managers report difficulties with onboarding new employees remotely, and concerns about company culture and collaboration persist among leadership teams.</p>
<p>The most successful companies seem to be those that have been intentional about their remote work policies, investing in tools and practices that support distributed teams rather than simply transplanting office culture to Zoom.</p>
</div>
<div style="text-align: center; font-size: 10px;">
<a href="#">Unsubscribe</a> | <a href="#">Manage preferences</a>
<p>© 2026 Newsletter Corp. All rights reserved.</p>
</div>
</body>
</html>`

const MINIMAL_HTML = `<p>Short.</p>`

const PLAIN_TEXT_EMAIL = `
Here is a plain text newsletter.

This is the second paragraph with enough content to be meaningful for the reader.

And a third paragraph that discusses something interesting about technology and its impact on society today.

Unsubscribe from this list.
`

describe('extractContent', () => {
  it('extracts paragraphs from newsletter HTML', () => {
    const result = extractContent(SAMPLE_NEWSLETTER_HTML)
    expect(result.paragraphs.length).toBeGreaterThanOrEqual(3)
  })

  it('removes tracking pixels', () => {
    const result = extractContent(SAMPLE_NEWSLETTER_HTML)
    const allText = result.paragraphs.join(' ')
    expect(allText).not.toContain('track/pixel')
  })

  it('removes unsubscribe boilerplate', () => {
    const result = extractContent(SAMPLE_NEWSLETTER_HTML)
    const allText = result.paragraphs.join(' ').toLowerCase()
    expect(allText).not.toContain('unsubscribe')
    expect(allText).not.toContain('all rights reserved')
  })

  it('generates a summary under 210 characters', () => {
    const result = extractContent(SAMPLE_NEWSLETTER_HTML)
    expect(result.summary.length).toBeLessThanOrEqual(210)
    expect(result.summary.length).toBeGreaterThan(0)
  })

  it('calculates a reasonable read time', () => {
    const result = extractContent(SAMPLE_NEWSLETTER_HTML)
    expect(result.readTime).toMatch(/^\d+ min$/)
    const minutes = parseInt(result.readTime)
    expect(minutes).toBeGreaterThanOrEqual(1)
    expect(minutes).toBeLessThanOrEqual(30)
  })

  it('handles minimal/short HTML gracefully', () => {
    const result = extractContent(MINIMAL_HTML)
    expect(result.paragraphs).toBeDefined()
    expect(result.readTime).toMatch(/^\d+ min$/)
  })

  it('handles plain text email content', () => {
    const result = extractContent(PLAIN_TEXT_EMAIL)
    expect(result.paragraphs.length).toBeGreaterThanOrEqual(2)
    const allText = result.paragraphs.join(' ').toLowerCase()
    expect(allText).not.toContain('unsubscribe')
  })

  it('filters out short artifact paragraphs', () => {
    const result = extractContent(SAMPLE_NEWSLETTER_HTML)
    result.paragraphs.forEach(p => {
      expect(p.length).toBeGreaterThanOrEqual(30)
    })
  })
})

describe('assignArticleColors', () => {
  it('returns known colors for recognized sources', () => {
    const result = assignArticleColors('Platformer')
    expect(result.heroColor).toBe('#1a1a2e')
    expect(result.accentColor).toBe('#e94560')
  })

  it('returns deterministic colors for unknown sources', () => {
    const result1 = assignArticleColors('Some Random Newsletter')
    const result2 = assignArticleColors('Some Random Newsletter')
    expect(result1.heroColor).toBe(result2.heroColor)
    expect(result1.accentColor).toBe(result2.accentColor)
  })

  it('returns dark heroColors for unknown sources', () => {
    const result = assignArticleColors('Unknown Source XYZ')
    const hex = result.heroColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    expect(luminance).toBeLessThan(0.3)
  })
})
