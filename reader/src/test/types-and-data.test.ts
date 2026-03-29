import { describe, it, expect } from 'vitest'
import type { Article, ViewTab, Category } from '../types/article'
import { CATEGORIES } from '../types/article'
import { SAMPLE_ARTICLES } from '../lib/sample-data'

describe('Article type and sample data', () => {
  it('exports CATEGORIES with correct values', () => {
    expect(CATEGORIES).toEqual(["All", "Tech", "Finance", "Strategy", "Culture", "Policy"])
  })

  it('has exactly 5 sample articles', () => {
    expect(SAMPLE_ARTICLES).toHaveLength(5)
  })

  it('each article has all required fields', () => {
    const requiredKeys: (keyof Article)[] = [
      'id', 'source', 'author', 'date', 'receivedAt', 'readTime',
      'category', 'title', 'summary', 'content', 'gmailMessageId',
      'heroColor', 'accentColor'
    ]
    SAMPLE_ARTICLES.forEach(article => {
      requiredKeys.forEach(key => {
        expect(article).toHaveProperty(key)
      })
    })
  })

  it('each article has 4-7 content paragraphs', () => {
    SAMPLE_ARTICLES.forEach(article => {
      expect(article.content.length).toBeGreaterThanOrEqual(4)
      expect(article.content.length).toBeLessThanOrEqual(7)
    })
  })

  it('articles are sorted newest first by receivedAt', () => {
    for (let i = 0; i < SAMPLE_ARTICLES.length - 1; i++) {
      const current = new Date(SAMPLE_ARTICLES[i].receivedAt).getTime()
      const next = new Date(SAMPLE_ARTICLES[i + 1].receivedAt).getTime()
      expect(current).toBeGreaterThan(next)
    }
  })

  it('each article has a unique id', () => {
    const ids = SAMPLE_ARTICLES.map(a => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('heroColors are dark (low luminance)', () => {
    SAMPLE_ARTICLES.forEach(article => {
      const hex = article.heroColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      expect(luminance).toBeLessThan(0.3)
    })
  })
})
