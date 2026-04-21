import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { Session } from '@/api/types'
import i18n from '@/lib/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const fetchSessions = async (): Promise<Session[]> => {
  const { data } = await api.get<{ sessions: Session[] }>(
    ENDPOINTS.SESSIONS.LIST
  )
  return data.sessions
}

const terminateSessionFn = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.SESSIONS.TERMINATE(id))
}

const terminateAllSessionsFn = async (): Promise<void> => {
  await api.delete(ENDPOINTS.SESSIONS.TERMINATE_ALL)
}

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  })
}

export function useTerminateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: terminateSessionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success(i18n.t('toast.sessionTerminated'))
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export function useTerminateAllSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: terminateAllSessionsFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success(i18n.t('toast.allSessionsTerminated'))
    },
    onError: () => {
      toast.error(i18n.t('toast.sessionsError'))
    }
  })
}
