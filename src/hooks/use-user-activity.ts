import { useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
] as const

export function useUserActivity(idleThreshold = 5 * 60 * 1000) {
  const lastActivityRef = useRef(Date.now())
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
    }

    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, handleActivity, { passive: true })
    )

    const interval = setInterval(() => {
      setIsActive(Date.now() - lastActivityRef.current < idleThreshold)
    }, 60_000)

    return () => {
      ACTIVITY_EVENTS.forEach((e) =>
        window.removeEventListener(e, handleActivity)
      )
      clearInterval(interval)
    }
  }, [idleThreshold])

  return isActive
}
