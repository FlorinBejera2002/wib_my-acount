import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import { useAuthStore } from '@/stores/auth-store'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useUserActivity } from './use-user-activity'

const SYNC_INTERVAL = 5 * 60 * 1000
const IDLE_THRESHOLD = 30 * 60 * 1000

export function useSyncRefresh() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isActive = useUserActivity(IDLE_THRESHOLD)
  const queryClient = useQueryClient()

  // Refs so the interval callback always reads current values
  // without needing to recreate the interval on every change.
  const isActiveRef = useRef(isActive)
  const isPendingRef = useRef(false)

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  useEffect(() => {
    if (!isAuthenticated) return

    const sync = async () => {
      if (isPendingRef.current) return
      if (!isActiveRef.current) return
      if (document.visibilityState !== 'visible') return

      isPendingRef.current = true
      try {
        await api.get(ENDPOINTS.SYNC.REFRESH)
        queryClient.invalidateQueries({ queryKey: ['policies'] })
        queryClient.invalidateQueries({ queryKey: ['quotes'] })
        queryClient.invalidateQueries({ queryKey: ['reminders'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      } catch {
        // background task — errors are intentionally swallowed
      } finally {
        isPendingRef.current = false
      }
    }

    sync()
    const id = setInterval(sync, SYNC_INTERVAL)
    return () => clearInterval(id)
  }, [isAuthenticated, queryClient])
}
