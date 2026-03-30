export function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            background: '#e4e0db',
            borderRadius: 16,
            minHeight: 200,
            padding: 20,
            animation: 'skeletonPulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 150}ms`,
          }}
        >
          {/* Category + read time row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ width: 60, height: 18, borderRadius: 10, background: '#d8d4cf' }} />
            <div style={{ width: 50, height: 18, borderRadius: 10, background: '#d8d4cf' }} />
          </div>

          {/* Source line */}
          <div style={{ width: 120, height: 12, borderRadius: 6, background: '#d8d4cf', marginBottom: 14 }} />

          {/* Title */}
          <div style={{ width: '90%', height: 20, borderRadius: 6, background: '#d8d4cf', marginBottom: 8 }} />
          <div style={{ width: '70%', height: 20, borderRadius: 6, background: '#d8d4cf', marginBottom: 16 }} />

          {/* Summary */}
          <div style={{ width: '100%', height: 14, borderRadius: 6, background: '#d8d4cf', marginBottom: 6 }} />
          <div style={{ width: '85%', height: 14, borderRadius: 6, background: '#d8d4cf' }} />
        </div>
      ))}
    </div>
  )
}
