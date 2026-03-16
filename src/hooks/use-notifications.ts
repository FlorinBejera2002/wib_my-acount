import type { Notification } from '@/api/types'
import i18n from '@/lib/i18n'
import { delay } from '@/lib/utils'
import { mockNotifications } from '@/mocks/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const fetchNotifications = async (): Promise<Notification[]> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.NOTIFICATIONS.LIST);
  // return data;

  await delay(400)
  return mockNotifications
}

const markReadFn = async (id: string): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));

  await delay(300)
  const notif = mockNotifications.find((n) => n.id === id)
  if (notif) notif.read = true
}

const markAllReadFn = async (): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);

  await delay(400)
  mockNotifications.forEach((n) => {
    n.read = true
  })
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markReadFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllReadFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success(i18n.t('toast.allNotificationsRead'))
    }
  })
}
