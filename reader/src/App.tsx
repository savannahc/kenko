import { useArticleState } from './hooks/useArticleState'
import { FeedHeader } from './components/FeedHeader'
import { FeedCard } from './components/FeedCard'
import { EmptyState } from './components/EmptyState'
import { ReaderView } from './components/ReaderView'

function App() {
  const {
    filteredArticles,
    unreadCount,
    isRead,
    toggleRead,
    archiveArticle,
    activeViewTab,
    setActiveViewTab,
    activeCategory,
    setActiveCategory,
    selectedArticle,
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
                onArchive={() => archiveArticle(article.id)}
                shouldAnimateOut={activeViewTab === 'Unread'}
              />
            ))}
          </div>
        )}
      </main>

      {selectedArticle && (
        <ReaderView
          article={selectedArticle}
          isRead={isRead(selectedArticle.id)}
          onClose={() => selectArticle(null)}
          onToggleRead={(read) => toggleRead(selectedArticle.id, read)}
          onArchive={() => archiveArticle(selectedArticle.id)}
        />
      )}
    </div>
  )
}

export default App
