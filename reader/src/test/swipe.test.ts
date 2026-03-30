import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSwipe } from '../hooks/useSwipe'

describe('useSwipe hook', () => {
  it('returns touch handlers and initial state', () => {
    const { result } = renderHook(() => useSwipe({ onSwipe: () => {} }))
    expect(result.current.onTouchStart).toBeDefined()
    expect(result.current.onTouchMove).toBeDefined()
    expect(result.current.onTouchEnd).toBeDefined()
    expect(result.current.swipeOffset).toBe(0)
    expect(result.current.isSwiping).toBe(false)
  })

  it('calls onSwipe when threshold is met', () => {
    const onSwipe = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipe }))

    // Simulate a leftward swipe exceeding 120px
    act(() => {
      result.current.onTouchStart({ touches: [{ clientX: 200, clientY: 100 }] } as any)
    })
    act(() => {
      result.current.onTouchMove({ touches: [{ clientX: 50, clientY: 100 }] } as any)
    })
    act(() => {
      result.current.onTouchEnd({} as any)
    })

    expect(onSwipe).toHaveBeenCalledOnce()
  })

  it('does not call onSwipe for short swipes', () => {
    const onSwipe = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipe }))

    act(() => {
      result.current.onTouchStart({ touches: [{ clientX: 200, clientY: 100 }] } as any)
    })
    act(() => {
      result.current.onTouchMove({ touches: [{ clientX: 180, clientY: 100 }] } as any)
    })
    act(() => {
      result.current.onTouchEnd({} as any)
    })

    expect(onSwipe).not.toHaveBeenCalled()
  })
})
