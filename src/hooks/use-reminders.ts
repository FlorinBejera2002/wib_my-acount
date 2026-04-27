import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  CreateReminderRequest,
  Reminder,
  UpdateReminderRequest
} from '@/api/types'
import i18n from '@/lib/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// ==================== Reminders (API) ====================

const fetchReminders = async (): Promise<Reminder[]> => {
  const { data } = await api.get<{ reminders: Reminder[] }>(
    ENDPOINTS.REMINDERS.LIST
  )
  return data.reminders
}

const createReminderFn = async (
  data: CreateReminderRequest
): Promise<Reminder> => {
  const { data: response } = await api.post<Reminder>(
    ENDPOINTS.REMINDERS.CREATE,
    data
  )
  return response
}

const updateReminderFn = async ({
  id,
  ...data
}: UpdateReminderRequest & { id: string }): Promise<Reminder> => {
  const { data: response } = await api.put<Reminder>(
    ENDPOINTS.REMINDERS.UPDATE(id),
    data
  )
  return response
}

const deleteReminderFn = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.REMINDERS.DELETE(id))
}

export function useReminders() {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: fetchReminders
  })
}

export function useCreateReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReminderFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success(i18n.t('toast.alertCreated'))
    },
    onError: () => {
      toast.error(i18n.t('toast.alertCreateError'))
    }
  })
}

export function useUpdateReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateReminderFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success(i18n.t('toast.alertUpdated'))
    },
    onError: () => {
      toast.error(i18n.t('toast.alertUpdateError'))
    }
  })
}

export function useDeleteReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteReminderFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success(i18n.t('toast.alertDeleted'))
    },
    onError: () => {
      toast.error(i18n.t('toast.alertDeleteError'))
    }
  })
}
