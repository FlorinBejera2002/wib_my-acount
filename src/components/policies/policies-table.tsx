import { Badge } from '@/components/ui/badge'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { usePolicies } from '@/hooks/use-policies'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { AlertCircle, Download, Inbox, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import type { Policy, TableParams } from '@/api/types'
import { PolicyDetailPanel } from './policy-detail-panel'
import { PolicyStatusBadge } from './policy-status-badge'

const COL_COUNT = 9

const computeDaysUntilExpiry = (endDate: string): number =>
  Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)

const filterConfigs = [
  {
    key: 'status',
    labelKey: 'policies.filterStatus',
    options: [
      { labelKey: 'policies.statusActive', value: 'active' },
      { labelKey: 'policies.statusExpired', value: 'expired' },
      { labelKey: 'policies.statusCancelled', value: 'cancelled' },
      { labelKey: 'policies.statusPending', value: 'pending' }
    ]
  },
  {
    key: 'type',
    labelKey: 'policies.filterType',
    options: [
      { labelKey: 'insuranceType.RCA', value: 'rca' },
      { labelKey: 'insuranceType.CASCO', value: 'casco' },
      { labelKey: 'insuranceType.CASCO_ECONOM', value: 'casco_econom' },
      {
        labelKey: 'insuranceType.CASCO_PERFECT_COVER',
        value: 'casco_perfect_cover'
      },
      { labelKey: 'insuranceType.HOME', value: 'home' },
      { labelKey: 'insuranceType.PAD', value: 'pad' },
      { labelKey: 'insuranceType.TRAVEL', value: 'travel' },
      { labelKey: 'insuranceType.HEALTH', value: 'health' },
      { labelKey: 'insuranceType.LIFE', value: 'life' },
      { labelKey: 'insuranceType.CMR', value: 'cmr' },
      { labelKey: 'insuranceType.RCP', value: 'rcp' },
      { labelKey: 'insuranceType.ACCIDENTS', value: 'accidents' },
      { labelKey: 'insuranceType.ACCIDENTS_TAXI', value: 'accidents_taxi' },
      {
        labelKey: 'insuranceType.ACCIDENTS_TRAVELER',
        value: 'accidents_traveler'
      },
      { labelKey: 'insuranceType.BREAKDOWN', value: 'breakdown' }
    ]
  }
]

/* ── Reusable tiny components ─────────────────────────────────────────── */

function PdfLink({ url, label }: { url: string; label?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-150 bg-gray-50/40 px-3 py-1.5 text-xs font-medium text-blue-600 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 hover:text-blue-700"
      title={label}
    >
      <Download className="h-3 w-3 shrink-0" />
      PDF
    </a>
  )
}

function ExpiryBadge({
  days,
  t
}: {
  days: number
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  if (days < 0) return null
  const label = t('policies.daysCount', { days })
  if (days <= 7)
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">
        {label}
      </Badge>
    )
  if (days <= 30)
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
        {label}
      </Badge>
    )
  return <span className="text-sm text-muted-foreground">{label}</span>
}

function HoverCell({
  text,
  maxWidth = 'max-w-[200px]'
}: { text: string; maxWidth?: string }) {
  if (text.length <= 30) {
    return <span className="text-sm text-gray-700">{text}</span>
  }
  return (
    <div className="relative group/cell">
      <span
        className={`text-sm text-gray-700 block ${maxWidth} truncate cursor-default`}
      >
        {text}
      </span>
      <div className="invisible opacity-0 group-hover/cell:visible group-hover/cell:opacity-100 transition-all duration-200 absolute z-50 left-0 top-full mt-1 max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-lg whitespace-normal">
        {text}
      </div>
    </div>
  )
}

/* ── Main export ──────────────────────────────────────────────────────── */

export function PoliciesTable() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(
    searchParams.get('policyId')
  )

  const openPolicy = (id: string) => setSelectedPolicyId(id)
  const closeSheet = () => setSelectedPolicyId(null)

  useEffect(() => {
    const paramId = searchParams.get('policyId')
    if (paramId) {
      openPolicy(paramId)
      searchParams.delete('policyId')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const [params, setParams] = useState<TableParams>({
    page: 1,
    limit: 9999,
    sort: 'createdAt',
    order: 'desc',
    search: ''
  })
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { data, isLoading, isError } = usePolicies(params)

  const filteredData = useMemo(() => {
    if (!data?.data) return []
    let items = data.data
    if (dateFrom) {
      const from = new Date(dateFrom)
      items = items.filter((p) => new Date(p.endDate) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      items = items.filter((p) => new Date(p.endDate) <= to)
    }
    return items.sort((a, b) => {
      const aExpired = a.status === 'expired'
      const bExpired = b.status === 'expired'
      if (aExpired === bExpired) return 0
      if (aExpired && !bExpired) return 1
      return -1
    })
  }, [data?.data, dateFrom, dateTo])

  const handleFilterChange = (key: string, value: string) =>
    setParams((prev) => ({
      ...prev,
      [key]: value === 'ALL' ? undefined : value
    }))

  const hasActiveFilters = dateFrom || dateTo || params.status || params.type

  const handleClearFilters = () => {
    setParams((prev) => ({ ...prev, status: undefined, type: undefined }))
    setDateFrom('')
    setDateTo('')
  }

  /* Loading skeleton */
  if (isLoading) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-2 pb-4">
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
        <div className="flex flex-col gap-3 lg:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="hidden lg:block rounded-xl border border-gray-100/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50 [&_th]:text-slate-500 [&_th]:text-xs [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-wider">
              <TableRow>
                {Array.from({ length: COL_COUNT }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, r) => (
                <TableRow key={r}>
                  {Array.from({ length: COL_COUNT }).map((_, c) => (
                    <TableCell key={c}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  /* Error */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-100/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] py-16">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <p className="font-medium text-foreground">{t('common.error')}</p>
          <p className="text-sm text-muted-foreground">
            {t('common.tryAgain')}
          </p>
        </div>
      </div>
    )
  }

  /* ── Render ── */
  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 pb-4">
        {filterConfigs.map((config) => (
          <Select
            key={config.key}
            value={
              (params as unknown as Record<string, string | undefined>)[
                config.key
              ] || 'ALL'
            }
            onValueChange={(v) => handleFilterChange(config.key, v)}
          >
            <SelectTrigger className="h-9 w-[130px] md:w-[160px]">
              <SelectValue placeholder={t(config.labelKey)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                {t('policies.allFilter', { label: t(config.labelKey) })}
              </SelectItem>
              {config.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden md:inline">
              {t('policies.clearFilters')}
            </span>
          </button>
        )}
      </div>

      {/* ═══ Mobile / Tablet card list (< lg) ═══ */}
      <div className="flex flex-col gap-5 lg:hidden">
        {filteredData.length > 0 ? (
          filteredData.map((policy) => {
            const days = computeDaysUntilExpiry(policy.endDate)
            const firstDoc = policy.documents?.[0]

            return (
              <PolicyCard
                key={policy.id}
                policy={policy}
                days={days}
                firstDoc={firstDoc}
                onNavigate={() => openPolicy(policy.id)}
                t={t}
              />
            )
          })
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-100/80 bg-white py-16 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <Inbox className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">{t('common.noResults')}</p>
          </div>
        )}
      </div>

      {/* ═══ Desktop table (lg+) ═══ */}
      <div className="hidden lg:block rounded-xl border border-gray-100/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-x-auto hide-scrollbar">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-slate-50 [&_th]:text-slate-500 [&_th]:text-xs [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-wider">
            <TableRow>
              <TableHead>{t('policies.policyRef')}</TableHead>
              <TableHead>{t('policies.type')}</TableHead>
              <TableHead>{t('policies.insurer')}</TableHead>
              <TableHead>{t('policies.policyDetails')}</TableHead>
              <TableHead>{t('policies.premium')}</TableHead>
              <TableHead>{t('policies.status')}</TableHead>
              <TableHead>{t('policies.expiry')}</TableHead>
              <TableHead>{t('policies.daysLeft')}</TableHead>
              <TableHead>{t('policies.pdf')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((policy) => {
                const days = computeDaysUntilExpiry(policy.endDate)
                const firstDoc = policy.documents?.[0]

                return (
                  <TableRow
                    key={policy.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50/50"
                    onClick={() => openPolicy(policy.id)}
                  >
                    <TableCell>
                      <span className="font-medium text-gray-900">
                        {policy.policyNumber}
                      </span>
                    </TableCell>

                    <TableCell>
                      <InsuranceTypeBadge
                        type={policy.insuranceType ?? policy.type}
                      />
                    </TableCell>

                    <TableCell>
                      <HoverCell text={policy.insurer ?? '—'} />
                    </TableCell>

                    <TableCell>
                      <HoverCell text={policy.data?.insured?.name ?? '—'} />
                    </TableCell>

                    <TableCell className="text-sm text-gray-900">
                      {formatCurrency(policy.premium)}
                    </TableCell>

                    <TableCell>
                      <PolicyStatusBadge status={policy.status} />
                    </TableCell>

                    <TableCell className="text-sm text-gray-700">
                      {formatDate(policy.endDate)}
                    </TableCell>

                    <TableCell>
                      {policy.status === 'active' ? (
                        <ExpiryBadge days={days} t={t} />
                      ) : (
                        '—'
                      )}
                    </TableCell>

                    <TableCell>
                      {firstDoc ? (
                        <PdfLink url={firstDoc.url} label={firstDoc.name} />
                      ) : null}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={COL_COUNT} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      {t('common.noResults')}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet
        open={!!selectedPolicyId}
        onOpenChange={(open) => !open && closeSheet()}
      >
        <SheetContent className="w-full md:max-w-xl overflow-y-auto">
          <SheetTitle className="sr-only">Policy details</SheetTitle>
          {selectedPolicyId && (
            <PolicyDetailPanel policyId={selectedPolicyId} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PolicyCard – mobile / tablet (< lg)                                  */
/* ═══════════════════════════════════════════════════════════════════════ */

function PolicyCard({
  policy,
  days,
  firstDoc,
  onNavigate,
  t
}: {
  policy: Policy
  days: number
  firstDoc?: { url: string; name: string }
  onNavigate: () => void
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-100/60 cursor-pointer"
        onClick={onNavigate}
      >
        <span className="font-bold text-gray-900 text-sm truncate">
          {policy.policyNumber}
        </span>
        <PolicyStatusBadge status={policy.status} />
      </div>

      {/* ── Body ── */}
      <div className="cursor-pointer px-4 py-4" onClick={onNavigate}>
        {/* Type badge */}
        <InsuranceTypeBadge
          type={policy.insuranceType ?? policy.type}
          className="px-2 py-0.5 text-[11px] gap-1 [&_svg]:h-3 [&_svg]:w-3"
        />

        {/* Mini-cards grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {/* Premium */}
          <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.premium')}
            </p>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(policy.premium)}
            </p>
          </div>

          {/* Expiry */}
          <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.expiry')}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(policy.endDate)}
            </p>
          </div>

          {/* Days left */}
          {policy.status === 'active' && days >= 0 && (
            <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.daysLeft')}
              </p>
              <p
                className={cn(
                  'text-sm font-semibold',
                  days <= 7 ? 'text-red-600' : 'text-gray-800'
                )}
              >
                {t('policies.daysCount', { days })}
              </p>
            </div>
          )}

          {/* Insurer */}
          <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.insurer')}
            </p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {policy.insurer ?? '—'}
            </p>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between mt-3">
          <div>
            {firstDoc && <PdfLink url={firstDoc.url} label={firstDoc.name} />}
          </div>
        </div>
      </div>
    </div>
  )
}
