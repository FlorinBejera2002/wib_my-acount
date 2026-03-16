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
  type CreateExpiryAlertFormValues,
  createExpiryAlertSchema
} from '@/lib/validators'
import {
  useCreateExpiryAlert,
  useDeleteExpiryAlert,
  useExpiryAlerts
} from '@/hooks/use-reminders'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Bell, Check, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  RCA: 'Asigurare Auto Obligatorie (RCA)',
  ASR: 'Asigurare Rutieră (ASR)',
  CALATORIE: 'Asigurare de Călătorie',
  LOCUINTA_PAD: 'Asigurare Locuință (PAD)',
  LOCUINTA_OPTIONALA: 'Asigurare Locuință Opțională',
  CASCO: 'Asigurare Auto Opțională (Casco)',
  ROVINIETA: 'Rovinieta',
  ITP: 'Inspecție Tehnică Periodică (ITP)',
  REVIZIE_AUTO: 'Revizie Auto',
  PERMIS: 'Permis de Conducere',
  BULETIN: 'Buletin',
  PASAPORT: 'Pașaport',
  ZIUA_SOTIEI: 'Ziua Soției'
}

const NOTIFY_BEFORE_LABELS: Record<NotifyBefore, string> = {
  '1_DAY': '1 zi înainte',
  '3_DAYS': '3 zile înainte',
  '7_DAYS': '7 zile înainte',
  '1_MONTH': '1 lună înainte',
  '2_MONTHS': '2 luni înainte',
  '3_MONTHS': '3 luni înainte',
  '6_MONTHS': '6 luni înainte'
}

const VEHICLE_TYPES: AlertType[] = [
  'RCA', 'ASR', 'CASCO', 'ROVINIETA', 'ITP', 'REVIZIE_AUTO'
]

const NAME_TYPES: AlertType[] = [
  'CALATORIE', 'PERMIS', 'BULETIN', 'PASAPORT', 'ZIUA_SOTIEI'
]

const HOUSING_TYPES: AlertType[] = [
  'LOCUINTA_PAD', 'LOCUINTA_OPTIONALA'
]

const DATE_LABELS: Partial<Record<AlertType, string>> = {
  ZIUA_SOTIEI: 'Ziua soției'
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ro-RO', {
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
  return (
    <div className="rounded-xl border border-gray-100 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-accent-green" />
          <span className="font-semibold text-gray-900">
            {ALERT_TYPE_LABELS[alert.alertType]}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(alert.id)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          Stergeti <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        {alert.licensePlate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Numar auto:</span>
            <span className="text-sm font-medium text-gray-900">{alert.licensePlate}</span>
          </div>
        )}
        {alert.shortAddress && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Adresa pe scurt:</span>
            <span className="text-sm font-medium text-gray-900">{alert.shortAddress}</span>
          </div>
        )}
        {alert.name && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Nume:</span>
            <span className="text-sm font-medium text-gray-900">{alert.name}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {DATE_LABELS[alert.alertType] ?? 'Data expirare'}:
          </span>
          <span className="text-sm font-medium text-gray-900">
            {formatDate(alert.expiryDate)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Data notificare:</span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-accent-green">
            <Bell className="h-3.5 w-3.5" />
            {formatDate(alert.notificationDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

function AddAlertForm({ onBack }: { onBack: () => void }) {
  const createAlert = useCreateExpiryAlert()

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreateExpiryAlertFormValues>({
    resolver: zodResolver(createExpiryAlertSchema),
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
  const dateLabel = DATE_LABELS[alertType] ?? 'Data expirare'

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
          Înapoi
        </button>
        <h1 className="text-xl font-bold text-gray-900">Adauga alerte</h1>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Alerta pentru</Label>
              <Controller
                control={control}
                name="alertType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectati" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ALERT_TYPE_LABELS) as AlertType[]).map(
                        (key) => (
                          <SelectItem key={key} value={key}>
                            {ALERT_TYPE_LABELS[key]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.alertType && (
                <p className="text-sm text-red-500">{errors.alertType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cu cat timp va anuntam inainte?</Label>
              <Controller
                control={control}
                name="notifyBefore"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectati" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(NOTIFY_BEFORE_LABELS) as NotifyBefore[]).map(
                        (key) => (
                          <SelectItem key={key} value={key}>
                            {NOTIFY_BEFORE_LABELS[key]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.notifyBefore && (
                <p className="text-sm text-red-500">{errors.notifyBefore.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showLicensePlate && (
              <div className="space-y-2">
                <Label>Numar auto</Label>
                <Input placeholder="Introduceti nr. auto" {...register('licensePlate')} />
              </div>
            )}

            {showAddress && (
              <div className="space-y-2">
                <Label>Adresa pe scurt</Label>
                <Input placeholder="Introduceti adresa pe scurt" {...register('shortAddress')} />
              </div>
            )}

            {showName && (
              <div className="space-y-2">
                <Label>Nume</Label>
                <Input placeholder="Introduceti numele" {...register('name')} />
              </div>
            )}

            <div className="space-y-2">
              <Label>{dateLabel}</Label>
              <Input type="date" {...register('expiryDate')} />
              {errors.expiryDate && (
                <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={createAlert.isPending}
            className="bg-accent-green hover:bg-accent-green-hover text-white gap-1.5"
          >
            <Check className="h-4 w-4" />
            {createAlert.isPending ? 'Se salvează...' : 'Salvati'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function RemindersPage() {
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
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Alerte de expirare</h1>
          <p className="text-sm text-gray-400">
            Primește notificări înainte de expirarea documentelor sau polițelor
          </p>
        </div>
        <Button
          onClick={() => setView('add')}
          className="bg-accent-green hover:bg-accent-green-hover text-white gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Adaugati alerta
        </Button>
      </div>

      {(!alerts || alerts.length === 0) ? (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/10 mb-4">
              <Bell className="h-6 w-6 text-accent-green" />
            </div>
            <p className="text-sm text-gray-400">
              Nu există alerte de expirare.
            </p>
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
