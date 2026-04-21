import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  CreateExpiryAlertRequest,
  CreateReminderRequest,
  ExpiryAlert,
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

// ==================== Expiry Alerts (local UI concept using Reminders API) ====================

const fetchExpiryAlerts = async (): Promise<ExpiryAlert[]> => {
  const { data } = await api.get<{ reminders: Reminder[] }>(
    ENDPOINTS.REMINDERS.LIST
  )
  return data.reminders.map((r) => ({
    id: r.id,
    alertType: (r.title as ExpiryAlert['alertType']) || 'RCA',
    notifyBefore: '1_MONTH' as const,
    expiryDate: r.remindAt,
    notificationDate: r.remindAt,
    createdAt: r.createdAt,
    name: r.note || undefined
  }))
}

const createExpiryAlertFn = async (
  data: CreateExpiryAlertRequest
): Promise<ExpiryAlert> => {
  const { data: response } = await api.post<Reminder>(
    ENDPOINTS.REMINDERS.CREATE,
    {
      title: data.alertType,
      remindAt: data.expiryDate,
      note: [data.licensePlate, data.name, data.shortAddress]
        .filter(Boolean)
        .join(' | ') || undefined
    }
  )
  return {
    id: response.id,
    alertType: data.alertType,
    notifyBefore: data.notifyBefore,
    licensePlate: data.licensePlate,
    name: data.name,
    shortAddress: data.shortAddress,
    expiryDate: data.expiryDate,
    notificationDate: response.remindAt,
    createdAt: response.createdAt
  }
}

const deleteExpiryAlertFn = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.REMINDERS.DELETE(id))
}

export function useExpiryAlerts() {
  return useQuery({
    queryKey: ['expiry-alerts'],
    queryFn: fetchExpiryAlerts
  })
}

export function useCreateExpiryAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExpiryAlertFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expiry-alerts'] })
      toast.success(i18n.t('toast.alertCreated'))
    },
    onError: () => {
      toast.error(i18n.t('toast.alertCreateError'))
    }
  })
}

export function useDeleteExpiryAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteExpiryAlertFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expiry-alerts'] })
      toast.success(i18n.t('toast.alertDeleted'))
    },
    onError: () => {
      toast.error(i18n.t('toast.alertDeleteError'))
    }
  })
}
