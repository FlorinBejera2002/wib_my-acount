import type { Reminder } from '@/api/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
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
import {
  ArrowLeft,
  Bell,
  Calendar,
  Car,
  Check,
  CreditCard,
  FileText,
  Home,
  Info,
  type LucideIcon,
  Plane,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  Truck,
  User,
  Wrench
} from 'lucide-react'
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
  alertType: string
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

const ALERT_TYPE_BADGE: Record<
  string,
  { bg: string; text: string; icon: LucideIcon }
> = {
  RCA: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Car },
  ASR: { bg: 'bg-rose-50', text: 'text-rose-700', icon: Shield },
  CASCO: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: ShieldCheck },
  CALATORIE: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Plane },
  LOCUINTA_PAD: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Home },
  LOCUINTA_OPTIONALA: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: Home
  },
  ROVINIETA: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Truck },
  ITP: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: Wrench },
  REVIZIE_AUTO: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: Wrench },
  PERMIS: { bg: 'bg-slate-50', text: 'text-slate-700', icon: CreditCard },
  BULETIN: { bg: 'bg-slate-50', text: 'text-slate-700', icon: FileText },
  PASAPORT: { bg: 'bg-slate-50', text: 'text-slate-700', icon: FileText },
  ZIUA_SOTIEI: { bg: 'bg-rose-50', text: 'text-rose-700', icon: User }
}

function formatAutoDays(days: number[]): string {
  return days.map((d) => (d === 1 ? '1 zi' : `${d} zile`)).join(', ')
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
    alertType: reminder.title || 'RCA',
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
    month: 'short',
    year: 'numeric'
  })
}

function isKnownAlertType(type: string): type is AlertType {
  return (ALERT_TYPE_KEYS as string[]).includes(type)
}

function getDaysLeft(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function AlertCard({
  alert,
  onDelete
}: {
  alert: ParsedAlert
  onDelete: (id: string) => void
}) {
  const { t } = useTranslation()
  const daysLeft = getDaysLeft(alert.expiryDate)
  const badge = ALERT_TYPE_BADGE[alert.alertType] ?? {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    icon: FileText
  }

  const subtitle = alert.licensePlate || alert.shortAddress || alert.name

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 bg-slate-50/60 px-4 py-3 border-b border-gray-100">
        <div className="min-w-0 flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold text-nowrap ${badge.bg} ${badge.text} border-current/15`}
          >
            <badge.icon className="h-3.5 w-3.5 shrink-0" />
            {isKnownAlertType(alert.alertType)
              ? t(`reminders.alertTypes.${alert.alertType}`)
              : alert.alertType}
          </span>
          {subtitle && (
            <p className="mt-1 text-sm font-medium text-gray-600 truncate">
              {subtitle}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDelete(alert.id)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body — mini-cards grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="rounded-lg bg-gray-50/80 border border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {alert.alertType === BIRTHDAY_TYPE
                ? t('reminders.wifesBirthday')
                : t('reminders.expiryDate')}
            </p>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <p className="text-sm font-semibold text-gray-900">
                {formatDateLocal(alert.expiryDate)}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50/80 border border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('reminders.notificationDate')}
            </p>
            <div className="flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-primary shrink-0" />
              <p className="text-sm font-semibold text-gray-900">
                {formatDateLocal(alert.notificationDate)}
              </p>
            </div>
          </div>

          {daysLeft >= 0 && (
            <div className="rounded-lg bg-gray-50/80 border border-gray-100 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.daysLeft')}
              </p>
              <p
                className={`text-sm font-bold ${
                  daysLeft <= 7
                    ? 'text-red-600'
                    : daysLeft <= 30
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                }`}
              >
                {t('policies.daysCount', { days: daysLeft })}
              </p>
            </div>
          )}

          <div className="rounded-lg bg-gray-50/80 border border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('reminders.notifyBefore')}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {t(`reminders.notifyBeforeLabels.${alert.notifyBefore}`)}
            </p>
          </div>
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
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-white p-5 space-y-3"
            >
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-gray-400">{t('reminders.noAlerts')}</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              {t('reminders.deleteConfirmTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('reminders.deleteConfirmDesc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteReminder.isPending}
              onClick={() => {
                if (deleteId) {
                  deleteReminder.mutate(deleteId, {
                    onSuccess: () => setDeleteId(null)
                  })
                }
              }}
            >
              {t('reminders.deleteConfirmBtn')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
