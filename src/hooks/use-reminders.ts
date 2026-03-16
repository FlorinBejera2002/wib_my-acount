import type { CreateExpiryAlertRequest, ExpiryAlert } from '@/api/types'
import i18n from '@/lib/i18n'
import { delay } from '@/lib/utils'
import { mockExpiryAlerts } from '@/mocks/reminders'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const NOTIFY_BEFORE_OFFSETS: Record<
  string,
  { days?: number; months?: number }
> = {
  '1_DAY': { days: 1 },
  '3_DAYS': { days: 3 },
  '7_DAYS': { days: 7 },
  '1_MONTH': { months: 1 },
  '2_MONTHS': { months: 2 },
  '3_MONTHS': { months: 3 },
  '6_MONTHS': { months: 6 }
}

function computeNotificationDate(
  expiryDate: string,
  notifyBefore: string
): string {
  const date = new Date(expiryDate)
  const offset = NOTIFY_BEFORE_OFFSETS[notifyBefore]
  if (offset?.days) date.setDate(date.getDate() - offset.days)
  if (offset?.months) date.setMonth(date.getMonth() - offset.months)
  return date.toISOString().slice(0, 10)
}

const fetchAlerts = async (): Promise<ExpiryAlert[]> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.REMINDERS.LIST)
  // return data

  await delay(400)
  return mockExpiryAlerts
}

const createAlertFn = async (
  data: CreateExpiryAlertRequest
): Promise<ExpiryAlert> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.post(ENDPOINTS.REMINDERS.CREATE, data)
  // return response

  await delay(500)
  const newAlert: ExpiryAlert = {
    id: `alert_${Date.now()}`,
    ...data,
    notificationDate: computeNotificationDate(
      data.expiryDate,
      data.notifyBefore
    ),
    createdAt: new Date().toISOString()
  }
  mockExpiryAlerts.unshift(newAlert)
  return newAlert
}

const deleteAlertFn = async (id: string): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.delete(ENDPOINTS.REMINDERS.DELETE(id))

  await delay(300)
  const index = mockExpiryAlerts.findIndex((a) => a.id === id)
  if (index !== -1) mockExpiryAlerts.splice(index, 1)
}

export function useExpiryAlerts() {
  return useQuery({
    queryKey: ['expiry-alerts'],
    queryFn: fetchAlerts
  })
}

export function useCreateExpiryAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAlertFn,
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
    mutationFn: deleteAlertFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expiry-alerts'] })
      toast.success(i18n.t('toast.alertDeleted'))
    },
    onError: () => {
      toast.error(i18n.t('toast.alertDeleteError'))
    }
  })
}
