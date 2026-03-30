import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('reader-install-dismissed') === 'true'
  })

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted' || outcome === 'dismissed') {
      setDeferredPrompt(null)
      setDismissed(true)
      localStorage.setItem('reader-install-dismissed', 'true')
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('reader-install-dismissed', 'true')
  }

  if (!deferredPrompt || dismissed) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 90,
        background: '#1a1a1a',
        borderRadius: 14,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      <span
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 14,
          color: '#e8e4df',
          flex: 1,
        }}
      >
        Install Reader for the best experience
      </span>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 13,
            color: '#8a8580',
            padding: '6px 10px',
          }}
        >
          Dismiss
        </button>
        <button
          onClick={handleInstall}
          style={{
            background: '#f2efeb',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: '#1a1a1a',
            padding: '6px 14px',
          }}
        >
          Install
        </button>
      </div>
    </div>
  )
}
