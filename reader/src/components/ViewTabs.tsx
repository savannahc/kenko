import type { ViewTab } from '../types/article'

interface ViewTabsProps {
  activeTab: ViewTab
  unreadCount: number
  onTabChange: (tab: ViewTab) => void
}

export function ViewTabs({ activeTab, unreadCount, onTabChange }: ViewTabsProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: '#e4e0db',
        borderRadius: 10,
        padding: 3,
        gap: 2,
      }}
    >
      {(['Unread', 'All'] as const).map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            padding: '6px 18px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 500,
            transition: 'all 0.2s ease',
            background: activeTab === tab ? '#fff' : 'transparent',
            color: activeTab === tab ? '#1a1a1a' : '#8a8580',
            boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {tab}
          {tab === 'Unread' && unreadCount > 0 && (
            <span
              style={{
                marginLeft: 6,
                color: '#d94040',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
