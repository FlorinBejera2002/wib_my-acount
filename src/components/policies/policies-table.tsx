import { Badge } from '@/components/ui/badge'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
import { formatCurrency, formatDate } from '@/lib/utils'
import { AlertCircle, Inbox, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import type { Policy, TableParams } from '@/api/types'
import { PolicyStatusBadge } from './policy-status-badge'

const getPolicySubtitle = (policy: Policy): string => {
  return policy.insurer ?? '—'
}

const computeDaysUntilExpiry = (endDate: string): number => {
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)
}

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
      { labelKey: 'insuranceType.rca', value: 'rca' },
      { labelKey: 'insuranceType.casco', value: 'casco' },
      { labelKey: 'insuranceType.home', value: 'home' },
      { labelKey: 'insuranceType.health', value: 'health' },
      { labelKey: 'insuranceType.travel', value: 'travel' },
      { labelKey: 'insuranceType.life', value: 'life' },
      { labelKey: 'insuranceType.other', value: 'other' }
    ]
  }
]

export function PoliciesTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()
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

    return items
  }, [data?.data, dateFrom, dateTo])

  const handleFilterChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value === 'ALL' ? undefined : value
    }))
  }

  const hasActiveFilters = dateFrom || dateTo || params.status || params.type

  const handleClearFilters = () => {
    setParams((prev) => ({
      ...prev,
      status: undefined,
      type: undefined
    }))
    setDateFrom('')
    setDateTo('')
  }

  const colCount = 10

  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-[140px]" />
            <Skeleton className="h-9 w-[140px]" />
            <Skeleton className="h-9 w-[140px]" />
            <Skeleton className="h-9 w-[140px]" />
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-x-auto hide-scrollbar">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-green-50">
              <TableRow>
                {Array.from({ length: colCount }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {Array.from({ length: colCount }).map((_, colIdx) => (
                    <TableCell key={colIdx}>
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-100 bg-white shadow-sm py-16">
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

  return (
    <div>
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {filterConfigs.map((config) => (
            <Select
              key={config.key}
              value={
                (params as unknown as Record<string, string | undefined>)[
                  config.key
                ] || 'ALL'
              }
              onValueChange={(value) => handleFilterChange(config.key, value)}
            >
              <SelectTrigger className="h-9 w-full sm:w-[140px]">
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
          {/* <div className="flex items-center gap-2 w-full">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-400 whitespace-nowrap hidden sm:inline">{t('policies.expiryFrom')}</span>
              <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 w-full sm:w-[140px]"
            />
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-400 whitespace-nowrap hidden sm:inline">{t('policies.expiryTo')}</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 w-full sm:w-[140px]"
            />
          </div>
          </div> */}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              {t('policies.clearFilters')}
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-x-auto hide-scrollbar">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-green-50">
            <TableRow>
              <TableHead className="w-10" />
              <TableHead className="min-w-[200px]">
                {t('policies.policyRef')}
              </TableHead>
              <TableHead className="min-w-[150px]">
                {t('policies.type')}
              </TableHead>
              <TableHead className="min-w-[150px]">
                {t('policies.insurer')}
              </TableHead>
              <TableHead className="min-w-[200px]">
                {t('policies.insuredObject')}
              </TableHead>
              <TableHead className="min-w-[100px]">
                {t('policies.premium')}
              </TableHead>
              <TableHead className="min-w-[100px]">
                {t('policies.status')}
              </TableHead>
              <TableHead className="min-w-[100px]">
                {t('policies.expiry')}
              </TableHead>
              <TableHead className="min-w-[100px]">
                {t('policies.daysLeft')}
              </TableHead>
              <TableHead />

            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((policy) => {
                const daysUntilExpiry = computeDaysUntilExpiry(policy.endDate)

                return (
                  <TableRow
                    key={policy.id}
                    className="transition-colors cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/policies/${policy.id}`)}
                  >
                    <TableCell className="w-10 px-3" />
                    <TableCell>
                      <span className="font-medium">
                        {policy.policyNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <InsuranceTypeBadge type={policy.type} />
                    </TableCell>
                    <TableCell>{policy.insurer ?? '—'}</TableCell>
                    <TableCell>
                      <span className="max-w-[220px] truncate block">
                        {getPolicySubtitle(policy)}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(policy.premium)}</TableCell>
                    <TableCell>
                      <PolicyStatusBadge status={policy.status} />
                    </TableCell>
                    <TableCell>{formatDate(policy.endDate)}</TableCell>
                    <TableCell>
                      {policy.status === 'active' ? (
                        <ExpiryBadge days={daysUntilExpiry} t={t} />
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={colCount} className="h-32 text-center">
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
    </div>
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
  if (days <= 7) {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">
        {label}
      </Badge>
    )
  }
  if (days <= 30) {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
        {label}
      </Badge>
    )
  }
  return <span className="text-sm text-muted-foreground">{label}</span>
}
