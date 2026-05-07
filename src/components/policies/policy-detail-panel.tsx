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
import { usePolicy } from '@/hooks/use-policies'
import { useCreateReminder } from '@/hooks/use-reminders'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Inbox,
  Info,
  Users
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PolicyStatusBadge } from './policy-status-badge'

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

export function PolicyDetailPanel({
  policyId,
  travellerIndex,
  onSelectTraveller,
  componentIndex
}: {
  policyId: string
  travellerIndex?: number | null
  onSelectTraveller?: (idx: number) => void
  componentIndex?: number | null
}) {
  const { t } = useTranslation()
  const { data: policy, isLoading, isError } = usePolicy(policyId)
  const [copiedId, setCopiedId] = useState(false)

  const handleCopyId = async () => {
    if (policy?.id) {
      await navigator.clipboard.writeText(policy.id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

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

  const daysUntilExpiry = Math.ceil(
    (new Date(policy.endDate).getTime() - Date.now()) / 86400000
  )

  /* ── Traveller-specific view ── */
  if (
    travellerIndex != null &&
    policy.travellers &&
    policy.travellers[travellerIndex]
  ) {
    const trav = policy.travellers[travellerIndex]
    const premiumPerTraveller =
      policy.travellers.length > 0
        ? policy.premium / policy.travellers.length
        : 0

    return (
      <div className="space-y-5">
        {/* ── Header ── */}
        <SheetHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <PolicyStatusBadge status={policy.status} />
          </div>
          <SheetTitle className="text-base md:text-xl font-bold text-gray-900 leading-tight">
            <div className="flex items-center gap-2">{trav.name}</div>
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {policy.policyNumber} <span className="text-blue-800">•</span>{' '}
            <InsuranceTypeBadge type={policy.insuranceType ?? policy.type} />
          </p>
        </SheetHeader>
        <Separator />

        {/* ── Details List ── */}
        <div className="space-y-0">
          {/* Quote Ref */}
          {policy.id && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.sourceQuote')}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {policy.id}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                title={copiedId ? t('common.copied') : t('common.copy')}
              >
                {copiedId ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          )}

          {/* Premium */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.insurancePremium')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {formatCurrency(premiumPerTraveller)}
              </p>
            </div>
          </div>

          {/* CNP */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.cnp')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {trav.cnp}
              </p>
            </div>
          </div>

          {/* Phone */}
          {trav.phone && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.phone')}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {trav.phone}
                </p>
              </div>
            </div>
          )}

          {/* Insurer */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.insurer')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {policy.insurerName ?? policy.insurer ?? '—'}
              </p>
            </div>
          </div>

          {/* Coverage Period */}
          <div
            className={`flex items-center gap-3 px-4 py-3 transition-colors ${policy.status === 'active' ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.coveragePeriod')}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(policy.startDate)} — {formatDate(policy.endDate)}
              </p>
            </div>
          </div>

          {/* Days Until Expiry */}
          {policy.status === 'active' && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors">
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
            </div>
          )}

          {/* Covers */}
          {trav.covers && trav.covers.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors">
              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
                  {t('policies.covers')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {trav.covers.map((cover) => (
                    <Badge key={cover} variant="secondary" className="text-xs">
                      {cover}
                    </Badge>
                  ))}
                </div>
              </div>
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
          {trav.documents.length > 0 ? (
            <div className="space-y-2">
              {trav.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-blue-600 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  {doc.name}
                </a>
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

  /* ── Component-specific view (PAD / Facultativă) ── */
  const resolvedComponents =
    policy.insuranceComponents && policy.insuranceComponents.length > 0
      ? policy.insuranceComponents
      : policy.insuranceType === 'pad_facultative'
        ? [
            {
              type: 'pad' as const,
              policyNumber: policy.policyNumber,
              insurerName: policy.insurerName ?? policy.insurer ?? '—',
              premium: policy.premium / 2,
              startDate: policy.startDate,
              endDate: policy.endDate,
              documents: [] as {
                id: string
                name: string
                type: string
                url: string
              }[]
            },
            {
              type: 'facultative' as const,
              policyNumber: policy.policyNumber,
              insurerName: policy.insurerName ?? policy.insurer ?? '—',
              premium: policy.premium / 2,
              startDate: policy.startDate,
              endDate: policy.endDate,
              documents: [] as {
                id: string
                name: string
                type: string
                url: string
              }[]
            }
          ]
        : null

  if (
    componentIndex != null &&
    resolvedComponents &&
    resolvedComponents[componentIndex]
  ) {
    const comp = resolvedComponents[componentIndex]
    const compDaysUntilExpiry = Math.ceil(
      (new Date(comp.endDate).getTime() - Date.now()) / 86400000
    )

    return (
      <div className="space-y-5">
        {/* ── Header ── */}
        <SheetHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <PolicyStatusBadge status={policy.status} />
          </div>
          <SheetTitle className="text-base md:text-xl font-bold text-gray-900 leading-tight">
            <div className="flex md:items-center gap-2 flex-col md:flex-row items-start">
              {comp.policyNumber}{' '}
              <span className="text-blue-800 hidden md:flex">•</span>
              <InsuranceTypeBadge type={comp.type} />
            </div>
          </SheetTitle>
        </SheetHeader>
        <Separator />

        {/* ── Details List ── */}
        <div className="space-y-0">
          {/* Quote Ref */}
          {policy.id && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.sourceQuote')}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {policy.id}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                title={copiedId ? t('common.copied') : t('common.copy')}
              >
                {copiedId ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          )}

          {/* Premium */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.insurancePremium')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {formatCurrency(comp.premium)}
              </p>
            </div>
          </div>

          {/* Insurer */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.insurer')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {comp.insurerName}
              </p>
            </div>
          </div>

          {/* Coverage Period */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.coveragePeriod')}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(comp.startDate)} — {formatDate(comp.endDate)}
              </p>
            </div>
          </div>

          {/* Days Until Expiry */}
          {policy.status === 'active' && compDaysUntilExpiry >= 0 && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.daysUntilExpiry')}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {t('policies.daysCount', { days: compDaysUntilExpiry })}
                  </p>
                  {compDaysUntilExpiry <= 7 && (
                    <Badge className="bg-red-100 text-red-700 border border-red-200 text-[10px] px-2 py-0.5 rounded">
                      {t('policies.expiresSoon')}
                    </Badge>
                  )}
                  {compDaysUntilExpiry > 7 && compDaysUntilExpiry <= 30 && (
                    <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded">
                      {t('policies.expiresSoon')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Insured Object (from parent policy) */}
          {(policy.policyDetails ?? policy.vehicleOrProperty) && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.policyDetails')}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {policy.policyDetails ?? policy.vehicleOrProperty}
                </p>
              </div>
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
          {comp.documents.length > 0 ? (
            <div className="space-y-2">
              {comp.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-blue-600 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  {doc.name}
                </a>
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
        {policy.id && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.sourceQuote')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {policy.id}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              title={copiedId ? t('common.copied') : t('common.copy')}
            >
              {copiedId ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {/* Premium */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.insurancePremium')}
            </p>
            <p className="text-sm font-semibold text-green-600 truncate">
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
              {policy.insurerName ?? policy.insurer ?? '—'}
            </p>
          </div>
        </div>

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
          <>
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
          </>
        )}

        {/* Policy Details / Vehicle */}
        {(policy.policyDetails ?? policy.vehicleOrProperty) && (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.policyDetails')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {policy.policyDetails ?? policy.vehicleOrProperty}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Travellers ── */}
      {policy.travellers && policy.travellers.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">
                {t('policies.travellers')}
              </h3>
              <Badge
                variant="outline"
                className="ml-auto text-[10px] font-medium"
              >
                {policy.travellers.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {policy.travellers.map((trav, idx) => {
                return (
                  <button
                    key={`trav-${idx}`}
                    type="button"
                    onClick={() => onSelectTraveller?.(idx)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-100/70 hover:border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {trav.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {trav.cnp}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Documents ── */}
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">
            {t('policies.documents')}
          </h3>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-6">
          <Inbox className="h-8 w-8 text-gray-300" />
          <p className="text-xs text-muted-foreground">
            {t('policies.noDocuments')}
          </p>
        </div>
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
