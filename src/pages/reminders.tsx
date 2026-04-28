import type { Reminder } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCreateReminder,
  useDeleteReminder,
  useReminders
} from '@/hooks/use-reminders'
import i18n from '@/lib/i18n'
import {
  type CreateExpiryAlertFormValues,
  createExpiryAlertSchema
} from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Bell, Check, Info, Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type AlertType =
  | 'RCA'
  | 'ASR'
  | 'CALATORIE'
  | 'LOCUINTA_PAD'
  | 'LOCUINTA_OPTIONALA'
  | 'CASCO'
  | 'ROVINIETA'
  | 'ITP'
  | 'REVIZIE_AUTO'
  | 'PERMIS'
  | 'BULETIN'
  | 'PASAPORT'
  | 'ZIUA_SOTIEI'

type NotifyBefore =
  | '1_DAY'
  | '3_DAYS'
  | '7_DAYS'
  | '1_MONTH'
  | '2_MONTHS'
  | '3_MONTHS'
  | '6_MONTHS'

interface ParsedAlert {
  id: string
  alertType: AlertType
  notifyBefore: NotifyBefore
  licensePlate?: string
  name?: string
  shortAddress?: string
  expiryDate: string
  notificationDate: string
  createdAt: string
}

const ALERT_TYPE_KEYS: AlertType[] = [
  'RCA',
  'ASR',
  'CALATORIE',
  'LOCUINTA_PAD',
  'LOCUINTA_OPTIONALA',
  'CASCO',
  'ROVINIETA',
  'ITP',
  'REVIZIE_AUTO',
  'PERMIS',
  'BULETIN',
  'PASAPORT',
  'ZIUA_SOTIEI'
]

const NOTIFY_BEFORE_KEYS: NotifyBefore[] = [
  '1_DAY',
  '3_DAYS',
  '7_DAYS',
  '1_MONTH',
  '2_MONTHS',
  '3_MONTHS',
  '6_MONTHS'
]

const VEHICLE_TYPES: AlertType[] = [
  'RCA',
  'ASR',
  'CASCO',
  'ROVINIETA',
  'ITP',
  'REVIZIE_AUTO'
]

const NAME_TYPES: AlertType[] = [
  'CALATORIE',
  'PERMIS',
  'BULETIN',
  'PASAPORT',
  'ZIUA_SOTIEI'
]

const HOUSING_TYPES: AlertType[] = ['LOCUINTA_PAD', 'LOCUINTA_OPTIONALA']

const BIRTHDAY_TYPE: AlertType = 'ZIUA_SOTIEI'

const AUTO_EMAIL_BY_ALERT: Record<string, number[] | null> = {
  RCA: [60, 30, 10, 1],
  CASCO: [30, 10, 1],
  ASR: [30, 10, 1],
  CALATORIE: [30, 10, 1],
  LOCUINTA_PAD: [25, 5],
  LOCUINTA_OPTIONALA: [25, 5],
  ROVINIETA: null,
  ITP: null,
  REVIZIE_AUTO: null,
  PERMIS: null,
  BULETIN: null,
  PASAPORT: null,
  ZIUA_SOTIEI: null
}

function formatAutoDays(days: number[]): string {
  return days
    .map((d) => (d === 1 ? '1 zi' : `${d} zile`))
    .join(', ')
}

function computeRemindAt(
  expiryDate: string,
  notifyBefore: NotifyBefore
): string {
  const date = new Date(expiryDate)
  switch (notifyBefore) {
    case '1_DAY':
      date.setDate(date.getDate() - 1)
      break
    case '3_DAYS':
      date.setDate(date.getDate() - 3)
      break
    case '7_DAYS':
      date.setDate(date.getDate() - 7)
      break
    case '1_MONTH':
      date.setMonth(date.getMonth() - 1)
      break
    case '2_MONTHS':
      date.setMonth(date.getMonth() - 2)
      break
    case '3_MONTHS':
      date.setMonth(date.getMonth() - 3)
      break
    case '6_MONTHS':
      date.setMonth(date.getMonth() - 6)
      break
  }
  return date.toISOString().slice(0, 10)
}

function parseReminderToAlert(reminder: Reminder): ParsedAlert {
  let notifyBefore: NotifyBefore = '1_MONTH'
  let licensePlate: string | undefined
  let name: string | undefined
  let shortAddress: string | undefined
  let expiryDate = reminder.remindAt

  if (reminder.note) {
    try {
      const parsed = JSON.parse(reminder.note)
      notifyBefore = parsed.notifyBefore || '1_MONTH'
      licensePlate = parsed.licensePlate || undefined
      name = parsed.name || undefined
      shortAddress = parsed.shortAddress || undefined
      expiryDate = parsed.expiryDate || reminder.remindAt
    } catch {
      // Legacy reminder with plain text note — use as name
      name = reminder.note
    }
  }

  return {
    id: reminder.id,
    alertType: (reminder.title as AlertType) || 'RCA',
    notifyBefore,
    licensePlate,
    name,
    shortAddress,
    expiryDate,
    notificationDate: reminder.remindAt,
    createdAt: reminder.createdAt
  }
}

function formatDateLocal(dateStr: string): string {
  const localeMap: Record<string, string> = {
    ro: 'ro-RO',
    hu: 'hu-HU',
    en: 'en-US'
  }
  const locale = localeMap[i18n.language] || 'en-US'
  const d = new Date(dateStr)
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function AlertCard({
  alert,
  onDelete
}: {
  alert: ParsedAlert
  onDelete: (id: string) => void
}) {
  const { t } = useTranslation()

  const dateLabel =
    alert.alertType === BIRTHDAY_TYPE
      ? t('reminders.wifesBirthday')
      : t('reminders.expiryDate')

  return (
    <div className="rounded-xl border border-gray-100 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-accent-green" />
          <span className="font-semibold text-gray-900">
            {t(`reminders.alertTypes.${alert.alertType}`)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(alert.id)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          {t('reminders.deleteBtn')} <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        {alert.licensePlate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {t('reminders.licensePlate')}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {alert.licensePlate}
            </span>
          </div>
        )}
        {alert.shortAddress && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {t('reminders.shortAddress')}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {alert.shortAddress}
            </span>
          </div>
        )}
        {alert.name && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{t('reminders.name')}</span>
            <span className="text-sm font-medium text-gray-900">
              {alert.name}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{dateLabel}</span>
          <span className="text-sm font-medium text-gray-900">
            {formatDateLocal(alert.expiryDate)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {t('reminders.notificationDate')}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <Bell className="h-3.5 w-3.5" />
            {formatDateLocal(alert.notificationDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

function AddAlertForm({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation()
  const createReminder = useCreateReminder()

  const schema = useMemo(() => createExpiryAlertSchema(t), [t])

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreateExpiryAlertFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      alertType: 'RCA',
      notifyBefore: '1_MONTH',
      licensePlate: '',
      name: '',
      shortAddress: '',
      expiryDate: ''
    }
  })

  const alertType = watch('alertType')
  const showLicensePlate = alertType && VEHICLE_TYPES.includes(alertType)
  const showName = alertType && NAME_TYPES.includes(alertType)
  const showAddress = alertType && HOUSING_TYPES.includes(alertType)
  const dateLabel =
    alertType === BIRTHDAY_TYPE
      ? t('reminders.wifesBirthday')
      : t('reminders.expiryDate')

  const onSubmit = (data: CreateExpiryAlertFormValues) => {
    createReminder.mutate(
      {
        title: data.alertType,
        remindAt: computeRemindAt(data.expiryDate, data.notifyBefore),
        note: JSON.stringify({
          notifyBefore: data.notifyBefore,
          licensePlate: data.licensePlate || undefined,
          name: data.name || undefined,
          shortAddress: data.shortAddress || undefined,
          expiryDate: data.expiryDate
        })
      },
      { onSuccess: () => onBack() }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('reminders.backBtn')}
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {t('reminders.addAlertTitle')}
        </h1>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Auto renewal info */}
          {alertType && AUTO_EMAIL_BY_ALERT[alertType] && (
            <div className="flex gap-2.5 rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-3">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                {t('reminders.autoRenewalInfo', {
                  type: t(`reminders.alertTypes.${alertType}`),
                  days: formatAutoDays(AUTO_EMAIL_BY_ALERT[alertType]!)
                })}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{t('reminders.alertFor')}</Label>
              <Controller
                control={control}
                name="alertType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('reminders.selectPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {ALERT_TYPE_KEYS.map((key) => (
                        <SelectItem key={key} value={key}>
                          {t(`reminders.alertTypes.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.alertType && (
                <p className="text-sm text-red-500">
                  {errors.alertType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('reminders.notifyBefore')}</Label>
              <Controller
                control={control}
                name="notifyBefore"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('reminders.selectPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFY_BEFORE_KEYS.map((key) => (
                        <SelectItem key={key} value={key}>
                          {t(`reminders.notifyBeforeLabels.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.notifyBefore && (
                <p className="text-sm text-red-500">
                  {errors.notifyBefore.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showLicensePlate && (
              <div className="space-y-2">
                <Label>{t('reminders.licensePlateLabel')}</Label>
                <Input
                  placeholder={t('reminders.licensePlatePlaceholder')}
                  {...register('licensePlate')}
                />
              </div>
            )}

            {showAddress && (
              <div className="space-y-2">
                <Label>{t('reminders.shortAddressLabel')}</Label>
                <Input
                  placeholder={t('reminders.shortAddressPlaceholder')}
                  {...register('shortAddress')}
                />
              </div>
            )}

            {showName && (
              <div className="space-y-2">
                <Label>{t('reminders.nameLabel')}</Label>
                <Input
                  placeholder={t('reminders.namePlaceholder')}
                  {...register('name')}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>{dateLabel}</Label>
              <Input type="date" {...register('expiryDate')} />
              {errors.expiryDate && (
                <p className="text-sm text-red-500">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {t('reminders.formErrors')}
              </p>
              <ul className="mt-1 list-disc pl-5 text-sm text-red-600">
                {Object.values(errors).map(
                  (err, i) =>
                    err?.message && (
                      <li key={`err-${i.toString()}`}>{err.message}</li>
                    )
                )}
              </ul>
            </div>
          )}

          <Button
            type="submit"
            disabled={createReminder.isPending}
            className="gap-1.5"
          >
            <Check className="h-4 w-4" />
            {createReminder.isPending
              ? t('common.saving')
              : t('reminders.saveBtn')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function RemindersPage() {
  const { t } = useTranslation()
  const { data: reminders, isLoading } = useReminders()
  const deleteReminder = useDeleteReminder()
  const [view, setView] = useState<'list' | 'add'>('list')

  const alerts = useMemo(
    () => reminders?.map(parseReminderToAlert),
    [reminders]
  )

  if (view === 'add') {
    return <AddAlertForm onBack={() => setView('list')} />
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-white p-5 space-y-3"
            >
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t('reminders.title')}
          </h1>
          <p className="text-sm text-gray-400">{t('reminders.subtitle')}</p>
        </div>
        <Button
          onClick={() => setView('add')}
          className="gap-1.5 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          {t('reminders.addAlert')}
        </Button>
      </div>

      {!alerts || alerts.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-gray-400">{t('reminders.noAlerts')}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDelete={(id) => deleteReminder.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
