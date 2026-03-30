import { useState, useEffect, type ReactNode } from 'react'
import { checkAuthStatus, getLoginUrl } from '../lib/api'

interface AuthGateProps {
  children: ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const [state, setState] = useState<'loading' | 'auth' | 'ready'>('loading')

  useEffect(() => {
    const skipped = sessionStorage.getItem('reader-auth-skipped') === 'true'
    if (skipped) {
      setState('ready')
      return
    }
    checkAuthStatus().then(({ authenticated }) => {
      setState(authenticated ? 'ready' : 'auth')
    })
  }, [])

  const handleSkip = () => {
    sessionStorage.setItem('reader-auth-skipped', 'true')
    setState('ready')
  }

  if (state === 'loading') {
    return (
      <div style={{ background: '#f2efeb', minHeight: '100vh' }} />
    )
  }

  if (state === 'auth') {
    return (
      <div
        style={{
          background: '#f2efeb',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: "'Newsreader', serif",
            fontSize: 32,
            fontWeight: 700,
            color: '#1a1a1a',
            margin: '0 0 12px',
          }}
        >
          Reader
        </h1>

        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 16,
            color: '#6b6560',
            margin: '0 0 32px',
            maxWidth: 300,
            lineHeight: 1.5,
          }}
        >
          Connect your Gmail to get started
        </p>

        <a
          href={getLoginUrl()}
          style={{
            display: 'inline-block',
            background: '#1a1a1a',
            color: '#fff',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            padding: '12px 28px',
            borderRadius: 10,
            textDecoration: 'none',
            marginBottom: 16,
          }}
        >
          Sign in with Google
        </a>

        <button
          onClick={handleSkip}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 14,
            color: '#8a8580',
            textDecoration: 'underline',
            padding: 8,
          }}
        >
          Or try with sample data
        </button>
      </div>
    )
  }

  return <>{children}</>
}
