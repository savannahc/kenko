import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Feed UI', () => {
  it('renders the Reader title', () => {
    render(<App />)
    expect(screen.getByText('Reader')).toBeInTheDocument()
  })

  it('shows correct unread count on load', () => {
    render(<App />)
    expect(screen.getByText('5 unread')).toBeInTheDocument()
  })

  it('renders all 5 article cards', () => {
    render(<App />)
    expect(screen.getByText('The AI Agent Wars Have Officially Begun')).toBeInTheDocument()
    expect(screen.getByText('The Tokenized Treasury Market Is Getting Weird')).toBeInTheDocument()
  })

  it('renders Unread and All view tabs', () => {
    render(<App />)
    expect(screen.getByText(/^Unread/)).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('renders all category filter tabs', () => {
    render(<App />)
    ;["All", "Tech", "Finance", "Strategy", "Culture", "Policy"].forEach(cat => {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument()
    })
  })

  it('has 5 read checkboxes (one per card)', () => {
    render(<App />)
    const checkboxes = screen.getAllByRole('button', { name: /mark as read/i })
    expect(checkboxes).toHaveLength(5)
  })
})
