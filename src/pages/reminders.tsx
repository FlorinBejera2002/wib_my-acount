import type { AlertType, ExpiryAlert, NotifyBefore } from '@/api/types'
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
  useCreateExpiryAlert,
  useDeleteExpiryAlert,
  useExpiryAlerts
} from '@/hooks/use-reminders'
import i18n from '@/lib/i18n'
import {
  type CreateExpiryAlertFormValues,
  createExpiryAlertSchema
} from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Bell, Check, Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  alert: ExpiryAlert
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
          <span className="flex items-center gap-1.5 text-sm font-medium text-accent-green">
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
  const createAlert = useCreateExpiryAlert()

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
    createAlert.mutate(
      {
        alertType: data.alertType,
        notifyBefore: data.notifyBefore,
        licensePlate: data.licensePlate || undefined,
        name: data.name || undefined,
        shortAddress: data.shortAddress || undefined,
        expiryDate: data.expiryDate
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
          className="flex items-center gap-1.5 text-sm font-medium text-accent-green hover:text-accent-green-hover transition-colors"
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

          <Button
            type="submit"
            disabled={createAlert.isPending}
            className="bg-accent-green hover:bg-accent-green-hover text-white gap-1.5"
          >
            <Check className="h-4 w-4" />
            {createAlert.isPending
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
  const { data: alerts, isLoading } = useExpiryAlerts()
  const deleteAlert = useDeleteExpiryAlert()
  const [view, setView] = useState<'list' | 'add'>('list')

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
          className="bg-accent-green hover:bg-accent-green-hover text-white gap-1.5 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          {t('reminders.addAlert')}
        </Button>
      </div>

      {!alerts || alerts.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/10 mb-4">
              <Bell className="h-6 w-6 text-accent-green" />
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
              onDelete={(id) => deleteAlert.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
