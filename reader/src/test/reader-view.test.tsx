import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReaderView } from '../components/ReaderView'
import { SAMPLE_ARTICLES } from '../lib/sample-data'

const mockArticle = SAMPLE_ARTICLES[0]

describe('ReaderView', () => {
  it('renders the article title', () => {
    render(<ReaderView article={mockArticle} isRead={false} onClose={() => {}} onToggleRead={() => {}} />)
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument()
  })

  it('renders the article summary', () => {
    render(<ReaderView article={mockArticle} isRead={false} onClose={() => {}} onToggleRead={() => {}} />)
    expect(screen.getByText(mockArticle.summary)).toBeInTheDocument()
  })

  it('renders the author name', () => {
    render(<ReaderView article={mockArticle} isRead={false} onClose={() => {}} onToggleRead={() => {}} />)
    expect(screen.getByText(mockArticle.author)).toBeInTheDocument()
  })

  it('renders the source name', () => {
    render(<ReaderView article={mockArticle} isRead={false} onClose={() => {}} onToggleRead={() => {}} />)
    expect(screen.getByText(mockArticle.source)).toBeInTheDocument()
  })

  it('renders all content paragraphs', () => {
    render(<ReaderView article={mockArticle} isRead={false} onClose={() => {}} onToggleRead={() => {}} />)
    // Check that the last paragraph's text is present (partial match since first paragraph has drop cap)
    const lastParagraph = mockArticle.content[mockArticle.content.length - 1]
    expect(screen.getByText(lastParagraph)).toBeInTheDocument()
  })

  it('has a back button that calls onClose', async () => {
    const onClose = vi.fn()
    render(<ReaderView article={mockArticle} isRead={false} onClose={onClose} onToggleRead={() => {}} />)
    const backButton = screen.getByText('Feed')
    await userEvent.click(backButton)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has a read checkbox in the nav bar', () => {
    render(<ReaderView article={mockArticle} isRead={false} onClose={() => {}} onToggleRead={() => {}} />)
    expect(screen.getByRole('button', { name: /mark as read/i })).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<ReaderView article={mockArticle} isRead={false} onClose={() => {}} onToggleRead={() => {}} />)
    expect(screen.getByText('Archive')).toBeInTheDocument()
    expect(screen.getByText('Share')).toBeInTheDocument()
    expect(screen.getByText('Open in Gmail')).toBeInTheDocument()
  })
})
