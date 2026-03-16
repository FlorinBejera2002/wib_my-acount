import type { Session } from '@/api/types'
import i18n from '@/lib/i18n'
import { delay } from '@/lib/utils'
import { mockSessions } from '@/mocks/sessions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const fetchSessions = async (): Promise<Session[]> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.SESSIONS.LIST);
  // return data;

  await delay(500)
  return mockSessions
}

const terminateSessionFn = async (id: string): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.delete(ENDPOINTS.SESSIONS.TERMINATE(id));

  await delay(400)
  const session = mockSessions.find((s) => s.id === id)
  if (session?.isCurrent) {
    throw new Error(i18n.t('toast.cannotTerminateCurrent'))
  }
}

const terminateAllSessionsFn = async (): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.delete(ENDPOINTS.SESSIONS.TERMINATE_ALL);

  await delay(600)
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
