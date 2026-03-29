import { useArticleState } from './hooks/useArticleState'
import { FeedHeader } from './components/FeedHeader'
import { FeedCard } from './components/FeedCard'
import { EmptyState } from './components/EmptyState'

function App() {
  const {
    filteredArticles,
    unreadCount,
    isRead,
    toggleRead,
    activeViewTab,
    setActiveViewTab,
    activeCategory,
    setActiveCategory,
    // selectedArticle used in next iteration (ReaderView)
    selectArticle,
  } = useArticleState()

  return (
    <div style={{ background: '#f2efeb', minHeight: '100vh' }}>
      <FeedHeader
        unreadCount={unreadCount}
        activeViewTab={activeViewTab}
        activeCategory={activeCategory}
        onTabChange={setActiveViewTab}
        onCategoryChange={setActiveCategory}
      />

      <main style={{ padding: '8px 16px 32px' }}>
        {filteredArticles.length === 0 ? (
          <EmptyState viewTab={activeViewTab} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredArticles.map((article, index) => (
              <FeedCard
                key={article.id}
                article={article}
                isRead={isRead(article.id)}
                index={index}
                onClick={() => selectArticle(article)}
                onToggleRead={(read) => toggleRead(article.id, read)}
                shouldAnimateOut={activeViewTab === 'Unread'}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
