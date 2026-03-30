import { useArticleState } from './hooks/useArticleState'
import { FeedHeader } from './components/FeedHeader'
import { FeedCard } from './components/FeedCard'
import { EmptyState } from './components/EmptyState'
import { ReaderView } from './components/ReaderView'
import { InstallPrompt } from './components/InstallPrompt'
import { AuthGate } from './components/AuthGate'
import { LoadingSkeleton } from './components/LoadingSkeleton'

function AppContent() {
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
    loading,
    refresh,
  } = useArticleState()

  return (
    <div style={{ background: '#f2efeb', minHeight: '100vh' }}>
      <FeedHeader
        unreadCount={unreadCount}
        activeViewTab={activeViewTab}
        activeCategory={activeCategory}
        onTabChange={setActiveViewTab}
        onCategoryChange={setActiveCategory}
        onRefresh={refresh}
        loading={loading}
      />

      <main style={{ padding: '8px 16px 32px' }}>
        {loading ? (
          <LoadingSkeleton />
        ) : filteredArticles.length === 0 ? (
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

      <InstallPrompt />

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

function App() {
  return (
    <AuthGate>
      <AppContent />
    </AuthGate>
  )
}

export default App
