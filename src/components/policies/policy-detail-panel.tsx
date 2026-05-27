import type { Policy } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { Separator } from '@/components/ui/separator'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useDownloadPolicyDocument, usePolicy } from '@/hooks/use-policies'
import { useCreateReminder } from '@/hooks/use-reminders'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  AlertCircle,
  Bell,
  Check,
  Download,
  FileText,
  Inbox,
  Info
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PolicyStatusBadge } from './policy-status-badge'

function getProductEntries(
  product: Record<string, unknown>
): [string, string][] {
  return Object.entries(product)
    .filter(
      ([key, val]) =>
        key !== 'system' && val !== null && val !== undefined && val !== ''
    )
    .map(([key, val]) => [key, String(val)])
}

const NOTIFY_OPTIONS = [
  { key: '3_MONTHS', days: 90 },
  { key: '6_MONTHS', days: 180 }
] as const

const AUTO_EMAIL_DAYS: Record<string, number[]> = {
  rca: [60, 30, 10, 1],
  casco: [30, 10, 1],
  casco_econom: [30, 10, 1],
  home: [25, 5],
  pad: [25, 5],
  pad_facultative: [25, 5],
  rcp: [30, 10, 1],
  cmr: [30, 10, 1],
  health: [30, 10, 1],
  breakdown: [30, 10, 1],
  travel: [30, 10, 1],
  accidents: [30, 15, 1],
  accidents_taxi: [30, 10, 1],
  accidents_traveler: [30, 10, 1]
}

function formatAutoDays(days: number[]): string {
  return days.map((d) => (d === 1 ? '1 zi' : `${d} zile`)).join(', ')
}

function computeRemindDate(endDate: string, days: number): string {
  const date = new Date(endDate)
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

function ReminderDialog({
  policy,
  open,
  onOpenChange
}: {
  policy: Policy
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const createReminder = useCreateReminder()
  const daysLeft = Math.ceil(
    (new Date(policy.endDate).getTime() - Date.now()) / 86400000
  )

  const policyType = (policy.insuranceType ?? policy.type).toLowerCase()
  const typeName = t(`insuranceType.${policyType.toUpperCase()}`, {
    defaultValue: policy.type
  })
  const autoDays = AUTO_EMAIL_DAYS[policyType] ?? [30, 10, 1]

  const handleSubmit = () => {
    if (!selected) return
    const option = NOTIFY_OPTIONS.find((o) => o.key === selected)
    if (!option) return

    const remindAt = computeRemindDate(policy.endDate, option.days)
    const title = `${typeName} — ${policy.policyNumber}`
    const note = JSON.stringify({
      notifyBefore: selected,
      expiryDate: policy.endDate,
      policyNumber: policy.policyNumber,
      policyType: policy.insuranceType ?? policy.type
    })

    createReminder.mutate(
      { title, remindAt, note },
      {
        onSuccess: () => {
          setDone(true)
          setTimeout(() => {
            onOpenChange(false)
            setDone(false)
            setSelected(null)
          }, 1500)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-800" />
            {t('policies.reminderTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-4">
          {/* Auto renewal emails info */}
          <div className="flex gap-2.5 rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-3">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              {t('policies.autoRenewalInfo', {
                days: formatAutoDays(autoDays)
              })}
            </p>
          </div>

          {/* Policy info */}
          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3.5 py-2.5">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {policy.policyNumber}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {typeName} — {t('policies.expiry')}: {formatDate(policy.endDate)}
            </p>
          </div>

          {/* Notify before options */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              {t('policies.notifyBefore')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {NOTIFY_OPTIONS.map((opt) => {
                const tooLate = opt.days >= daysLeft
                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={tooLate}
                    onClick={() => !tooLate && setSelected(opt.key)}
                    className={cn(
                      'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      tooLate
                        ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                        : selected === opt.key
                          ? 'border-blue-800 bg-blue-50 text-blue-800'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    {t(`reminders.notifyBeforeLabels.${opt.key}`)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={!selected || createReminder.isPending || done}
            onClick={handleSubmit}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200',
              done
                ? 'bg-green-600'
                : 'bg-blue-800 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {done ? (
              <>
                <Check className="h-4 w-4" />
                {t('policies.reminderSuccess')}
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                {t('policies.setReminder')}
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PolicyDetailPanel({ policyId }: { policyId: string }) {
  const { t } = useTranslation()
  const { data: policy, isLoading, isError } = usePolicy(policyId)
  const downloadDoc = useDownloadPolicyDocument()
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </SheetHeader>
        <Skeleton className="h-[72px] w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <Separator />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !policy) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-sm font-medium text-gray-900">{t('common.error')}</p>
        <p className="text-xs text-muted-foreground">
          {t('policies.notFound')}
        </p>
      </div>
    )
  }

  const daysUntilExpiry = policy.daysUntilExpiry

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <SheetHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <PolicyStatusBadge status={policy.status} />
        </div>
        <SheetTitle className="text-base md:text-xl font-bold text-gray-900 leading-tight">
          <div className="flex md:items-center gap-2 flex-col md:flex-row items-start">
            {policy.policyNumber}{' '}
            <span className="text-blue-800 hidden md:flex">•</span>
            <InsuranceTypeBadge type={policy.insuranceType ?? policy.type} />
          </div>
        </SheetTitle>
      </SheetHeader>
      <Separator />

      {/* ── Details List ── */}
      <div className="space-y-0">
        {/* Quote Ref */}
        {policy.quoteRef && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.sourceQuote')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {policy.quoteRef}
              </p>
            </div>
          </div>
        )}

        {/* Premium */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.insurancePremium')}
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {formatCurrency(policy.premium)}
            </p>
          </div>
        </div>

        {/* Insurer */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.insurer')}
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {policy.insurer ?? '—'}
            </p>
          </div>
        </div>

        {/* Product fields — dynamic */}
        {(() => {
          const product = policy.data?.product
          if (!product || Array.isArray(product)) return null
          return getProductEntries(product as Record<string, unknown>).map(
            ([key, val]) => (
              <div
                key={key}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                    {t(`policies.product.${key}`, {
                      defaultValue: key.replace(/([A-Z])/g, ' $1').trim()
                    })}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {key === 'destination'
                      ? t(`destination.${val}`, { defaultValue: val })
                      : key === 'purpose'
                        ? t(`purpose.${val}`, { defaultValue: val })
                        : key === 'vehicleType'
                          ? t(`vehicleType.${val}`, { defaultValue: val })
                          : typeof val === 'string' &&
                              val.startsWith('malpraxis_')
                            ? t(`malpraxis.${val}`, { defaultValue: val })
                            : key === 'type'
                              ? (() => {
                                  const n = (val as string)
                                    ?.toLowerCase()
                                    .trim()
                                  if (
                                    [
                                      'apartamentbloc',
                                      'apartment',
                                      'apartament'
                                    ].includes(n)
                                  )
                                    return t('policies.product.apartment', {
                                      defaultValue: 'Apartament'
                                    })
                                  if (
                                    ['casa', 'house', 'vila', 'vilă'].includes(
                                      n
                                    )
                                  )
                                    return t('policies.product.house', {
                                      defaultValue: 'Casă'
                                    })
                                  return val as string
                                })()
                              : key === 'areaSqm'
                                ? `${val} m²`
                                : (val as string)}
                  </p>
                </div>
              </div>
            )
          )
        })()}

        {/* Insured person */}
        {policy.data?.insured?.name && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.policyDetails')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {policy.data.insured.name}
              </p>
            </div>
          </div>
        )}

        {/* CNP */}
        {policy.data?.insured?.cnp && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.cnp')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate font-mono">
                {policy.data.insured.cnp}
              </p>
            </div>
          </div>
        )}

        {/* Coverage Period */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.coveragePeriod')}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(policy.startDate)} — {formatDate(policy.endDate)}
            </p>
          </div>
        </div>

        {/* Days Until Expiry + Reminder */}
        {policy.status === 'active' && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.daysUntilExpiry')}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {t('policies.daysCount', { days: daysUntilExpiry })}
                </p>
                {daysUntilExpiry <= 7 && (
                  <Badge className="bg-red-100 text-red-700 border border-red-200 text-[10px] px-2 py-0.5 rounded">
                    {t('policies.expiresSoon')}
                  </Badge>
                )}
                {daysUntilExpiry > 7 && daysUntilExpiry <= 30 && (
                  <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded">
                    {t('policies.expiresSoon')}
                  </Badge>
                )}
              </div>
            </div>
            <PolicyReminderButton policy={policy} />
          </div>
        )}
      </div>

      {/* ── Documents ── */}
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">
            {t('policies.documents')}
          </h3>
        </div>
        {policy.fileIds && Object.keys(policy.fileIds).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(policy.fileIds).map(([fileType, fileId]) => (
              <button
                key={fileId}
                type="button"
                disabled={downloadingId === fileId}
                onClick={() => {
                  setDownloadingId(fileId)
                  downloadDoc.mutate(
                    {
                      transactionId: policy.transactionId ?? '',
                      fileId
                    },
                    { onSettled: () => setDownloadingId(null) }
                  )
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-blue-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4 shrink-0" />
                {t(`policies.fileType.${fileType}`, { defaultValue: fileType })}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-6">
            <Inbox className="h-8 w-8 text-gray-300" />
            <p className="text-xs text-muted-foreground">
              {t('policies.noDocuments')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PolicyReminderButton                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */

function PolicyReminderButton({ policy }: { policy: Policy }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
      >
        <Bell className="h-3.5 w-3.5" />
        {t('policies.setReminder')}
      </button>
      <ReminderDialog policy={policy} open={open} onOpenChange={setOpen} />
    </>
  )
}
