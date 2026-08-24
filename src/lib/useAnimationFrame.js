import { useEffect, useRef } from 'react'

export default function useAnimationFrame(callback, active = true) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!active) return undefined

    let frameId
    let lastTime = performance.now()

    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      callbackRef.current(dt)
      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [active])
}
