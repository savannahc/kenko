import type { ViewTab } from '../types/article'

interface EmptyStateProps {
  viewTab: ViewTab
}

export function EmptyState({ viewTab }: EmptyStateProps) {
  const isUnread = viewTab === 'Unread'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        textAlign: 'center',
      }}
    >
      {/* Checkmark circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#e4e0db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8a8580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isUnread ? (
            <path d="M5 13l4 4L19 7" />
          ) : (
            <>
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
            </>
          )}
        </svg>
      </div>

      <h3
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 22,
          fontWeight: 600,
          color: '#1a1a1a',
          margin: '0 0 8px',
        }}
      >
        {isUnread ? 'All caught up' : 'No articles yet'}
      </h3>

      <p
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 15,
          color: '#8a8580',
          margin: 0,
          maxWidth: 260,
          lineHeight: 1.5,
        }}
      >
        {isUnread
          ? "You've read everything. Check back later for new newsletters."
          : 'Articles from your subscriptions will appear here.'}
      </p>
    </div>
  )
}
