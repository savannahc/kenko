import type { Category } from '../types/article'
import { CATEGORIES } from '../types/article'

interface CategoryTabsProps {
  activeCategory: Category
  onCategoryChange: (cat: Category) => void
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        paddingBottom: 2,
      }}
    >
      {CATEGORIES.map(cat => {
        const isActive = cat === activeCategory
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: isActive ? '1.5px solid #1a1a1a' : '1.5px solid #d8d4cf',
              cursor: 'pointer',
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              background: isActive ? '#1a1a1a' : 'transparent',
              color: isActive ? '#fff' : '#6b6560',
              flexShrink: 0,
            }}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
