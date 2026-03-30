import type { ViewTab, Category } from '../types/article'
import { ViewTabs } from './ViewTabs'
import { CategoryTabs } from './CategoryTabs'
import { useOfflineStatus } from '../hooks/useOfflineStatus'

interface FeedHeaderProps {
  unreadCount: number
  activeViewTab: ViewTab
  activeCategory: Category
  onTabChange: (tab: ViewTab) => void
  onCategoryChange: (cat: Category) => void
}

export function FeedHeader({
  unreadCount,
  activeViewTab,
  activeCategory,
  onTabChange,
  onCategoryChange,
}: FeedHeaderProps) {
  const { isOnline } = useOfflineStatus()
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#f2efeb',
        paddingTop: 16,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Newsreader', serif",
              fontSize: 26,
              fontWeight: 700,
              color: '#1a1a1a',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Reader
          </h1>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#8a8580',
              marginTop: 2,
              display: 'block',
            }}
          >
            {unreadCount} unread
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isOnline && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 500,
                color: '#d94040',
                background: 'rgba(217,64,64,0.1)',
                padding: '3px 10px',
                borderRadius: 12,
              }}
            >
              Offline
            </span>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 8,
              color: '#8a8580',
              marginTop: -2,
            }}
            aria-label="Refresh"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <ViewTabs
          activeTab={activeViewTab}
          unreadCount={unreadCount}
          onTabChange={onTabChange}
        />
      </div>

      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </header>
  )
}
