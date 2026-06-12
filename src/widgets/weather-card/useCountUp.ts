import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 300): number {
  const roundedTarget = Math.round(target)
  const [displayValue, setDisplayValue] = useState(roundedTarget)
  const displayRef = useRef(roundedTarget)
  const frameRef = useRef<number>()

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reducedMotion) {
      setDisplayValue(roundedTarget)
      displayRef.current = roundedTarget
      return
    }

    const from = displayRef.current

    if (from === roundedTarget) {
      return
    }

    const start = performance.now()

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const next = Math.round(from + (roundedTarget - from) * progress)

      setDisplayValue(next)
      displayRef.current = next

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [roundedTarget, duration])

  return displayValue
}
