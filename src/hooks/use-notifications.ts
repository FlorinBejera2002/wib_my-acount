import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { Notification } from '@/api/types'
import i18n from '@/lib/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get<{ notifications: Notification[] }>(
    ENDPOINTS.NOTIFICATIONS.LIST
  )
  return data.notifications
}

const markReadFn = async (id: string): Promise<Notification> => {
  const { data } = await api.patch<Notification>(
    ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
  )
  return data
}

const markAllReadFn = async (): Promise<void> => {
  await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
}

const deleteNotificationFn = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE(id))
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

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteNotificationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
}
