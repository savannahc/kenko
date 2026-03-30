import { useRef, useCallback, useState } from 'react'

interface UseSwipeOptions {
  onSwipe: () => void
}

export function useSwipe({ onSwipe }: UseSwipeOptions) {
  const startX = useRef(0)
  const startY = useRef(0)
  const startTime = useRef(0)
  const currentX = useRef(0)
  const locked = useRef<'horizontal' | 'vertical' | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    startX.current = touch.clientX
    startY.current = touch.clientY
    startTime.current = Date.now()
    currentX.current = touch.clientX
    locked.current = null
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const deltaX = touch.clientX - startX.current
    const deltaY = touch.clientY - startY.current

    // Lock direction after 10px of movement
    if (locked.current === null && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      locked.current = Math.abs(deltaY) > Math.abs(deltaX) ? 'vertical' : 'horizontal'
    }

    if (locked.current === 'vertical') return

    if (locked.current === 'horizontal') {
      currentX.current = touch.clientX
      const offset = Math.min(0, deltaX) // Only allow left swipe
      setSwipeOffset(offset)
      setIsSwiping(true)
    }
  }, [])

  const onTouchEnd = useCallback((_e?: React.TouchEvent) => {
    const deltaX = currentX.current - startX.current
    const elapsed = (Date.now() - startTime.current) / 1000
    const velocity = Math.abs(deltaX) / elapsed

    if (deltaX < -120 || (velocity > 0.5 && deltaX < -30)) {
      onSwipe()
    }

    setSwipeOffset(0)
    setIsSwiping(false)
    locked.current = null
  }, [onSwipe])

  return { onTouchStart, onTouchMove, onTouchEnd, swipeOffset, isSwiping }
}
