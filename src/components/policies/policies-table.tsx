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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useDownloadPolicyDocument, usePolicies } from '@/hooks/use-policies'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Inbox,
  Loader2,
  X
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import type { Policy, TableParams } from '@/api/types'
import { PolicyDetailPanel } from './policy-detail-panel'
import { PolicyStatusBadge } from './policy-status-badge'

const COL_COUNT = 9

function getProductEntries(policy: Policy): [string, string][] {
  const product = policy.data?.product
  if (!product || Array.isArray(product)) return []
  return Object.entries(product as Record<string, unknown>)
    .filter(
      ([key, val]) =>
        key !== 'system' && val !== null && val !== undefined && val !== ''
    )
    .map(([key, val]) => [key, String(val)])
}

function ProductDetailsCell({
  policy,
  disabled
}: {
  policy: Policy
  disabled?: boolean
}) {
  const { t } = useTranslation()
  const entries = getProductEntries(policy)

  if (entries.length === 0) {
    const insuredName = policy.data?.insured?.name
    return <span className="text-sm text-gray-500">{insuredName ?? '—'}</span>
  }

  const summary = entries
    .map(([key, val]) => {
      if (key === 'destination')
        return t(`destination.${val}`, { defaultValue: val })
      if (key === 'purpose') return t(`purpose.${val}`, { defaultValue: val })
      if (key === 'vehicleType')
        return t(`vehicleType.${val}`, { defaultValue: val })
      if (val?.startsWith('malpraxis_'))
        return t(`malpraxis.${val}`, { defaultValue: val })
      if (key === 'type') {
        const normalized = val?.toLowerCase().trim()
        if (['apartamentbloc', 'apartment', 'apartament'].includes(normalized))
          return t('policies.product.apartment', { defaultValue: 'Apartament' })
        if (['casa', 'house', 'vila', 'vilă'].includes(normalized))
          return t('policies.product.house', { defaultValue: 'Casă' })
        return val
      }
      if (key === 'areaSqm') return `${val} m²`
      return val
    })
    .join(' · ')

  if (disabled) {
    return (
      <span className="text-sm text-gray-700 block max-w-[200px] truncate">
        {summary}
      </span>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <span className="text-sm text-gray-700 block max-w-[200px] truncate cursor-default">
          {summary}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        className="bg-white text-gray-700 border border-gray-200 shadow-lg p-3 max-w-xs"
      >
        <div className="space-y-1">
          {entries.map(([key, val]) => (
            <div key={key} className="flex gap-2 text-xs">
              <span className="text-gray-400 shrink-0">
                {t(`policies.product.${key}`, {
                  defaultValue: key.replace(/([A-Z])/g, ' $1').trim()
                })}
                :
              </span>
              <span className="font-medium">
                {key === 'destination'
                  ? t(`destination.${val}`, { defaultValue: val })
                  : key === 'purpose'
                    ? t(`purpose.${val}`, { defaultValue: val })
                    : key === 'vehicleType'
                      ? t(`vehicleType.${val}`, { defaultValue: val })
                      : val?.startsWith('malpraxis_')
                        ? t(`malpraxis.${val}`, { defaultValue: val })
                        : key === 'type'
                          ? (() => {
                              const normalized = val?.toLowerCase().trim()
                              if (
                                [
                                  'apartamentbloc',
                                  'apartment',
                                  'apartament'
                                ].includes(normalized)
                              )
                                return t('policies.product.apartment', {
                                  defaultValue: 'Apartament'
                                })
                              if (
                                ['casa', 'house', 'vila', 'vilă'].includes(
                                  normalized
                                )
                              )
                                return t('policies.product.house', {
                                  defaultValue: 'Casă'
                                })
                              return val
                            })()
                          : key === 'areaSqm'
                            ? `${val} m²`
                            : val}
              </span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

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

function PdfButton({
  transactionId,
  fileIds
}: {
  transactionId: string | null | undefined
  fileIds?: Record<string, string>
}) {
  const { t } = useTranslation()
  const downloadDoc = useDownloadPolicyDocument()

  const fileId = fileIds?.policy_pdf ?? Object.values(fileIds ?? {})[0]

  if (!fileId) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toast.info(t('policies.noDocuments'))
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50/40 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
      >
        <Download className="h-3 w-3 shrink-0 opacity-40" />
        <span className="line-through opacity-60">PDF</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled={downloadDoc.isPending}
      onClick={(e) => {
        e.stopPropagation()
        downloadDoc.mutate({
          transactionId: transactionId ?? '',
          fileId
        })
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-150 bg-gray-50/40 px-3 py-1.5 text-xs font-medium text-blue-600 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="h-3 w-3 shrink-0" />
      PDF
    </button>
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
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <span
          className={`text-sm text-gray-700 block ${maxWidth} truncate cursor-default`}
        >
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        className="bg-white text-gray-700 border border-gray-200 shadow-lg max-w-xs whitespace-normal"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

/* ── Package grouping ─────────────────────────────────────────────────── */

const GROUPABLE_TYPES = new Set(['home', 'travel'])

type TableItem =
  | { kind: 'single'; policy: Policy }
  | {
      kind: 'group'
      policyType: string
      groupKey: string
      policies: Policy[]
      totalPremium: number
    }

function buildTableItems(policies: Policy[]): TableItem[] {
  const byGroupKey = new Map<string, Policy[]>()

  for (const policy of policies) {
    const key = policy.quoteRef ?? policy.comboId
    if (GROUPABLE_TYPES.has(policy.type) && key) {
      const arr = byGroupKey.get(key) ?? []
      arr.push(policy)
      byGroupKey.set(key, arr)
    }
  }

  const addedGroups = new Set<string>()
  const items: TableItem[] = []

  for (const policy of policies) {
    const key = policy.quoteRef ?? policy.comboId
    if (GROUPABLE_TYPES.has(policy.type) && key) {
      const group = byGroupKey.get(key)!
      if (group.length >= 2) {
        if (!addedGroups.has(key)) {
          addedGroups.add(key)
          items.push({
            kind: 'group',
            policyType: policy.type,
            groupKey: key,
            policies: group,
            totalPremium: group.reduce((sum, p) => sum + p.premium, 0)
          })
        }
        continue
      }
    }
    items.push({ kind: 'single', policy })
  }

  return items
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
      setSelectedPolicyId(paramId)
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

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

  const tableItems = useMemo(
    () => buildTableItems(filteredData),
    [filteredData]
  )

  const toggleGroup = (key: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

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
        {tableItems.length > 0 ? (
          tableItems.map((item) => {
            if (item.kind === 'group') {
              return (
                <PackageCard
                  key={`group-${item.groupKey}`}
                  item={item}
                  isExpanded={expandedGroups.has(item.groupKey)}
                  onToggle={() => toggleGroup(item.groupKey)}
                  onNavigate={openPolicy}
                  t={t}
                />
              )
            }
            const days = computeDaysUntilExpiry(item.policy.endDate)
            return (
              <PolicyCard
                key={item.policy.id}
                policy={item.policy}
                days={days}
                onNavigate={() => openPolicy(item.policy.id)}
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
      <div className="hidden lg:block rounded-xl border border-gray-100/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-x-auto hide-scrollbar min-h-[420px]">
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
            {tableItems.length > 0 ? (
              tableItems.flatMap((item) => {
                if (item.kind === 'group') {
                  const rep = item.policies[0]
                  if (!rep) return []
                  const days = computeDaysUntilExpiry(rep.endDate)
                  const isExpanded = expandedGroups.has(item.groupKey)

                  const isGroupPending = item.totalPremium === 0

                  const rows = [
                    <TableRow
                      key={`group-${item.groupKey}`}
                      className={cn(
                        'transition-colors',
                        isGroupPending
                          ? 'opacity-60 cursor-default bg-gray-50/30'
                          : 'cursor-pointer hover:bg-gray-50/50'
                      )}
                      onClick={
                        isGroupPending
                          ? () => toast.info(t('policies.pendingIssuance'))
                          : () => toggleGroup(item.groupKey)
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isGroupPending ? (
                            <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin shrink-0" />
                          ) : isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                          )}
                          <span className="font-medium text-gray-700">
                            {item.groupKey}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <InsuranceTypeBadge
                          type={
                            item.policyType === 'home'
                              ? 'pad_facultative'
                              : item.policyType
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <HoverCell text={rep.insurer ?? '—'} />
                      </TableCell>
                      <TableCell>
                        <ProductDetailsCell
                          policy={rep}
                          disabled={isGroupPending}
                        />
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.totalPremium)}
                      </TableCell>
                      <TableCell>
                        <PolicyStatusBadge status={rep.status} />
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {formatDate(rep.endDate)}
                      </TableCell>
                      <TableCell>
                        {rep.status === 'active' ? (
                          <ExpiryBadge days={days} t={t} />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        —
                      </TableCell>
                    </TableRow>
                  ]

                  if (isExpanded) {
                    rows.push(
                      <TableRow
                        key={`group-${item.groupKey}-sub`}
                        className="hover:bg-transparent border-0"
                      >
                        <TableCell
                          colSpan={COL_COUNT}
                          className="bg-gray-50/80 py-3 px-4 pl-12"
                        >
                          <SubTable
                            policies={item.policies}
                            policyType={item.policyType}
                            onSelect={openPolicy}
                            t={t}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  }

                  return rows
                }

                const { policy } = item
                const days = computeDaysUntilExpiry(policy.endDate)
                const isPending = policy.premium === 0

                return [
                  <TableRow
                    key={policy.id}
                    className={cn(
                      'transition-colors',
                      isPending
                        ? 'opacity-60 cursor-default bg-gray-50/30'
                        : 'cursor-pointer hover:bg-gray-50/50'
                    )}
                    onClick={
                      isPending
                        ? () => toast.info(t('policies.pendingIssuance'))
                        : () => openPolicy(policy.id)
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isPending && (
                          <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin shrink-0" />
                        )}
                        <span className="font-medium text-gray-900">
                          {policy.policyNumber}
                        </span>
                      </div>
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
                      <ProductDetailsCell
                        policy={policy}
                        disabled={isPending}
                      />
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
                      <PdfButton
                        transactionId={policy.transactionId}
                        fileIds={policy.fileIds}
                      />
                    </TableCell>
                  </TableRow>
                ]
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
/*  PackageCard – mobile home package (< lg)                             */
/* ═══════════════════════════════════════════════════════════════════════ */

function PackageCard({
  item,
  isExpanded,
  onToggle,
  onNavigate,
  t
}: {
  item: {
    policyType: string
    groupKey: string
    policies: Policy[]
    totalPremium: number
  }
  isExpanded: boolean
  onToggle: () => void
  onNavigate: (id: string) => void
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  const rep = item.policies[0]
  if (!rep) return null
  const days = computeDaysUntilExpiry(rep.endDate)
  const isGroupPending = item.totalPremium === 0

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200/80 bg-gray-50/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden',
        isGroupPending && 'opacity-60'
      )}
    >
      {/* ── Header ── */}
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-4 py-3 bg-gray-100/60',
          isGroupPending ? 'cursor-default' : 'cursor-pointer'
        )}
        onClick={
          isGroupPending
            ? () => toast.info(t('policies.pendingIssuance'))
            : onToggle
        }
      >
        <div className="flex items-center gap-2 min-w-0">
          {isGroupPending ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin shrink-0" />
          ) : isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
          )}
          <span className="font-bold text-gray-900 text-sm truncate">
            {item.groupKey}
          </span>
        </div>
        <PolicyStatusBadge status={rep.status} />
      </div>

      {/* ── Summary ── */}
      <div className="px-4 py-4">
        <InsuranceTypeBadge
          type={
            item.policyType === 'home' ? 'pad_facultative' : item.policyType
          }
          className="px-2 py-0.5 text-[11px] gap-1 [&_svg]:h-3 [&_svg]:w-3"
        />

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.premium')}
            </p>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(item.totalPremium)}
            </p>
          </div>

          <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.expiry')}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(rep.endDate)}
            </p>
          </div>

          {rep.status === 'active' && days >= 0 && (
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
        </div>
      </div>

      {/* ── Sub-policies (expanded) ── */}
      {isExpanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {item.policies.map((sub) => {
            const subPending = sub.premium === 0
            return (
              <div
                key={sub.id}
                className={cn(
                  'px-4 py-3 transition-colors',
                  subPending
                    ? 'opacity-60 cursor-default'
                    : 'cursor-pointer hover:bg-gray-50'
                )}
                onClick={
                  subPending
                    ? () => toast.info(t('policies.pendingIssuance'))
                    : () => onNavigate(sub.id)
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {sub.policyNumber}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {sub.insurer ?? '—'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <InsuranceTypeBadge
                      type={sub.insuranceType ?? sub.type}
                      className="px-2 py-0.5 text-[11px] gap-1 [&_svg]:h-3 [&_svg]:w-3"
                    />
                    <span className="text-xs font-semibold text-gray-700">
                      {formatCurrency(sub.premium)}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <PdfButton
                    transactionId={sub.transactionId}
                    fileIds={sub.fileIds}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PolicyCard – mobile / tablet (< lg)                                  */
/* ═══════════════════════════════════════════════════════════════════════ */

function PolicyCard({
  policy,
  days,
  onNavigate,
  t
}: {
  policy: Policy
  days: number
  onNavigate: () => void
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  const isPending = policy.premium === 0
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200/80 bg-gray-50/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden',
        isPending && 'opacity-60'
      )}
    >
      {/* ── Header ── */}
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-4 py-3 bg-gray-100/60',
          isPending ? 'cursor-default' : 'cursor-pointer'
        )}
        onClick={
          isPending
            ? () => toast.info(t('policies.pendingIssuance'))
            : onNavigate
        }
      >
        <div className="flex items-center gap-2 min-w-0">
          {isPending && (
            <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin shrink-0" />
          )}
          <span className="font-bold text-gray-900 text-sm truncate">
            {policy.policyNumber}
          </span>
        </div>
        <PolicyStatusBadge status={policy.status} />
      </div>

      {/* ── Body ── */}
      <div
        className={cn(
          'px-4 py-4',
          isPending ? 'cursor-default' : 'cursor-pointer'
        )}
        onClick={
          isPending
            ? () => toast.info(t('policies.pendingIssuance'))
            : onNavigate
        }
      >
        {/* Type badge */}
        <InsuranceTypeBadge
          type={policy.insuranceType ?? policy.type}
          className="px-2 py-0.5 text-[11px] gap-1 [&_svg]:h-3 [&_svg]:w-3"
        />

        {/* Mini-cards grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {/* Insured name fallback when no product fields */}
          {getProductEntries(policy).length === 0 &&
            policy.data?.insured?.name && (
              <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5 col-span-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.insuredName')}
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {policy.data.insured.name}
                </p>
              </div>
            )}
          {/* Product fields */}
          {getProductEntries(policy).map(([key, val]) => (
            <div
              key={key}
              className="rounded-lg bg-white border border-gray-100 px-3 py-2.5"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t(`policies.product.${key}`, {
                  defaultValue: key.replace(/([A-Z])/g, ' $1').trim()
                })}
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {key === 'destination'
                  ? t(`destination.${val}`, { defaultValue: val })
                  : key === 'purpose'
                    ? t(`purpose.${val}`, { defaultValue: val })
                    : key === 'areaSqm'
                      ? `${val} m²`
                      : val}
              </p>
            </div>
          ))}
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
            <PdfButton
              transactionId={policy.transactionId}
              fileIds={policy.fileIds}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SubTable – nested table inside expanded group row (desktop)          */
/* ═══════════════════════════════════════════════════════════════════════ */

function SubTable({
  policies,
  policyType,
  onSelect,
  t
}: {
  policies: Policy[]
  policyType: string
  onSelect: (id: string) => void
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  const isTravel = policyType === 'travel'
  const headers = isTravel
    ? [
        t('policies.policyRef'),
        t('policies.travellerName'),
        t('policies.cnp'),
        t('policies.premium'),
        t('policies.pdf')
      ]
    : [
        t('policies.policyRef'),
        t('policies.type'),
        t('policies.insurer'),
        t('policies.premium'),
        t('policies.pdf')
      ]

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent !border-b !border-slate-200/70">
          {headers.map((label) => (
            <TableHead
              key={label}
              className="text-xs font-medium text-slate-500 uppercase tracking-wide"
            >
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((sub) => {
          const subPending = sub.premium === 0
          return (
            <TableRow
              key={sub.id}
              className={cn(
                'transition-colors',
                subPending
                  ? 'opacity-60 cursor-default bg-gray-50/30'
                  : 'cursor-pointer hover:bg-gray-50/50'
              )}
              onClick={
                subPending
                  ? () => toast.info(t('policies.pendingIssuance'))
                  : () => onSelect(sub.id)
              }
            >
              <TableCell className="text-sm font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  {subPending && (
                    <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin shrink-0" />
                  )}
                  {sub.policyNumber}
                </div>
              </TableCell>
              {isTravel ? (
                <>
                  <TableCell className="text-sm font-medium text-gray-900">
                    {sub.data?.insured?.name ?? '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {sub.data?.insured?.cnp ?? '—'}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <InsuranceTypeBadge type={sub.insuranceType ?? sub.type} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {sub.insurer ?? '—'}
                  </TableCell>
                </>
              )}
              <TableCell className="text-sm text-gray-900">
                {formatCurrency(sub.premium)}
              </TableCell>
              <TableCell>
                <PdfButton
                  transactionId={sub.transactionId}
                  fileIds={sub.fileIds}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
