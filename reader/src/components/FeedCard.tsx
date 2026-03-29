import { useState } from 'react'
import type { Article } from '../types/article'
import { ReadCheckbox } from './ReadCheckbox'

interface FeedCardProps {
  article: Article
  isRead: boolean
  index: number
  onClick: () => void
  onToggleRead: (read: boolean) => void
  shouldAnimateOut: boolean
}

export function FeedCard({
  article,
  isRead,
  index,
  onClick,
  onToggleRead,
  shouldAnimateOut,
}: FeedCardProps) {
  const [animatingOut, setAnimatingOut] = useState(false)

  const handleToggleRead = (read: boolean) => {
    if (read && shouldAnimateOut) {
      setAnimatingOut(true)
      setTimeout(() => {
        onToggleRead(read)
      }, 400)
    } else {
      onToggleRead(read)
    }
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: article.heroColor,
        borderRadius: 16,
        minHeight: 200,
        padding: '0 20px 20px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        opacity: animatingOut ? 0 : isRead ? 0.55 : 1,
        transform: animatingOut ? 'translateY(-10px) scale(0.97)' : undefined,
        transition: animatingOut
          ? 'opacity 0.4s ease, transform 0.4s ease'
          : 'opacity 0.3s ease',
        animation: `feedCardIn 0.4s ease both`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          height: 3,
          background: isRead ? 'rgba(255,255,255,0.15)' : article.accentColor,
          borderRadius: '0 0 2px 2px',
          marginLeft: -20,
          marginRight: -20,
          transition: 'background 0.3s ease',
        }}
      />

      {/* Top row: category pill left, read time + checkbox right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 500,
            color: isRead ? 'rgba(255,255,255,0.4)' : article.accentColor,
            background: isRead
              ? 'rgba(255,255,255,0.06)'
              : `${article.accentColor}18`,
            padding: '3px 10px',
            borderRadius: 12,
            letterSpacing: '0.02em',
            transition: 'all 0.3s ease',
          }}
        >
          {article.category}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            {article.readTime}
          </span>
          <ReadCheckbox
            checked={isRead}
            accentColor={article.accentColor}
            onChange={handleToggleRead}
          />
        </div>
      </div>

      {/* Source · Author */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 8,
        }}
      >
        {article.source} · {article.author}
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 22,
          fontWeight: 600,
          color: '#fff',
          margin: '0 0 10px',
          lineHeight: 1.25,
        }}
      >
        {article.title}
      </h2>

      {/* Summary */}
      <p
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 14,
          color: 'rgba(255,255,255,0.6)',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {article.summary}
      </p>
    </div>
  )
}
