import { useEffect, useRef, useState } from 'react'
import type { Article } from '../types/article'
import { ReadCheckbox } from './ReadCheckbox'

interface ReaderViewProps {
  article: Article
  isRead: boolean
  onClose: () => void
  onToggleRead: (read: boolean) => void
}

export function ReaderView({ article, isRead, onClose, onToggleRead }: ReaderViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      setHeaderOpacity(Math.min(el.scrollTop / 100, 1))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#faf8f5',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      {/* Sticky nav bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: `rgba(250,248,245,${headerOpacity * 0.95})`,
          backdropFilter: headerOpacity > 0 ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: headerOpacity > 0 ? 'blur(20px)' : 'none',
          transition: 'background 0.15s ease',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 15,
            color: '#666',
            padding: '4px 0',
          }}
          aria-label="Back to feed"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Feed
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#888',
            }}
          >
            {article.source}
          </span>
          <ReadCheckbox
            checked={isRead}
            accentColor={article.accentColor}
            onChange={onToggleRead}
            onLight
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        style={{
          height: '100vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Hero section */}
        <div
          style={{
            background: article.heroColor,
            padding: '72px 24px 40px',
            position: 'relative',
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: article.accentColor,
            }}
          />

          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 500,
                color: article.accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: 16,
              }}
            >
              {article.category}
            </span>

            <h1
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 30,
                fontWeight: 700,
                color: '#fff',
                margin: '0 0 16px',
                lineHeight: 1.2,
              }}
            >
              {article.title}
            </h1>

            <p
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 17,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.6)',
                margin: '0 0 20px',
                lineHeight: 1.5,
              }}
            >
              {article.summary}
            </p>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {article.author} · {article.date} · {article.readTime}
            </span>
          </div>
        </div>

        {/* Article body */}
        <div
          style={{
            padding: '40px 24px',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          {article.content.map((paragraph, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 17.5,
                color: '#2a2a2a',
                lineHeight: 1.75,
                margin: '0 0 24px',
                animation: 'readerParaIn 0.4s ease both',
                animationDelay: `${i * 50}ms`,
                ...(i === 0 ? { textIndent: 0 } : {}),
              }}
            >
              {i === 0 ? (
                <>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: 48,
                      float: 'left',
                      lineHeight: 0.85,
                      marginRight: 8,
                      marginTop: 4,
                      color: article.accentColor,
                    }}
                  >
                    {paragraph.charAt(0)}
                  </span>
                  {paragraph.slice(1)}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}

          {/* Bottom actions */}
          <div
            style={{
              borderTop: '1px solid #e8e4df',
              paddingTop: 24,
              marginTop: 16,
              display: 'flex',
              gap: 10,
            }}
          >
            {['Archive', 'Share', 'Open in Gmail'].map(label => (
              <button
                key={label}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 10,
                  border: '1.5px solid #e0dcd7',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#666',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = article.accentColor
                  e.currentTarget.style.color = article.accentColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0dcd7'
                  e.currentTarget.style.color = '#666'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bottom spacer */}
          <div style={{ height: 60 }} />
        </div>
      </div>
    </div>
  )
}
