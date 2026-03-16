import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { usePolicies } from '@/hooks/use-policies'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Download,
  Inbox,
  User,
  Users,
  X
} from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { Policy, TableParams } from '@/api/types'
import { PolicyStatusBadge } from './policy-status-badge'

const EXPANDABLE_TYPES = [
  'CALATORIE',
  'LOCUINTA_PAD',
  'LOCUINTA_FACULTATIVA'
]

const getPolicyDetailsDisplay = (policy: Policy): string => {
  // Travel insurance
  if (policy.type === 'CALATORIE') {
    const parts = []
    if (policy.travelDestination) parts.push(policy.travelDestination)
    if (policy.travelPurpose) parts.push(policy.travelPurpose)
    if (policy.transportationType) parts.push(policy.transportationType)
    return parts.length > 0 ? parts.join(', ') : policy.policyDetails || '—'
  }

  // Home insurance (PAD and Facultativa)
  if (policy.type === 'LOCUINTA_PAD' || policy.type === 'LOCUINTA_FACULTATIVA') {
    const parts = []
    if (policy.propertyType) parts.push(policy.propertyType)
    if (policy.propertyArea) parts.push(`${policy.propertyArea} mp`)
    if (policy.insuredAmount) parts.push(`${policy.insuredAmount.toLocaleString()} EUR`)
    if (policy.padNumber && policy.type === 'LOCUINTA_PAD') parts.push(`PAD: ${policy.padNumber}`)
    return parts.length > 0 ? parts.join(', ') : policy.policyDetails || '—'
  }

  // Default for other types
  return policy.policyDetails || '—'
}

const filterConfigs = [
  {
    key: 'status',
    labelKey: 'policies.filterStatus',
    options: [
      { labelKey: 'policies.statusActive', value: 'ACTIVE' },
      { labelKey: 'policies.statusExpired', value: 'EXPIRED' },
      { labelKey: 'policies.statusCancelled', value: 'CANCELLED' },
      { labelKey: 'policies.statusTerminated', value: 'TERMINATED' }
    ]
  },
  {
    key: 'type',
    labelKey: 'policies.filterType',
    options: [
      { labelKey: 'insuranceType.RCA', value: 'RCA' },
      { labelKey: 'insuranceType.CASCO', value: 'CASCO' },
      { labelKey: 'insuranceType.CASCO_ECONOM', value: 'CASCO_ECONOM' },
      { labelKey: 'insuranceType.LOCUINTA_PAD', value: 'LOCUINTA_PAD' },
      { labelKey: 'insuranceType.LOCUINTA_FACULTATIVA', value: 'LOCUINTA_FACULTATIVA' },
      { labelKey: 'insuranceType.CALATORIE', value: 'CALATORIE' },
      { labelKey: 'insuranceType.ASISTENTA_RUTIERA', value: 'ASISTENTA_RUTIERA' },
      { labelKey: 'insuranceType.MALPRAXIS', value: 'MALPRAXIS' },
      { labelKey: 'insuranceType.SANATATE', value: 'SANATATE' },
      { labelKey: 'insuranceType.ACCIDENTE_CALATORI', value: 'ACCIDENTE_CALATORI' },
      { labelKey: 'insuranceType.ACCIDENTE_PERSOANE', value: 'ACCIDENTE_PERSOANE' },
      { labelKey: 'insuranceType.ACCIDENTE_TAXI', value: 'ACCIDENTE_TAXI' },
      { labelKey: 'insuranceType.CMR', value: 'CMR' },
      { labelKey: 'insuranceType.VIATA', value: 'VIATA' }
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
    search: '',
    filters: {}
  })

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

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

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleFilterChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value === 'ALL' ? '' : value
      }
    }))
  }

  const hasActiveFilters =
    dateFrom ||
    dateTo ||
    Object.values(params.filters || {}).some((v) => v && v !== 'ALL')

  const handleClearFilters = () => {
    setParams((prev) => ({
      ...prev,
      filters: {}
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
          <p className="font-medium text-foreground">
            {t('common.error')}
          </p>
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
              value={params.filters?.[config.key] || 'ALL'}
              onValueChange={(value) => handleFilterChange(config.key, value)}
            >
              <SelectTrigger className="h-9 w-full sm:w-[140px]">
                <SelectValue placeholder={t(config.labelKey)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('policies.allFilter', { label: t(config.labelKey) })}</SelectItem>
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
              <TableHead className="min-w-[200px]">{t('policies.policyRef')}</TableHead>
              <TableHead className="min-w-[150px]">{t('policies.type')}</TableHead>
              <TableHead className="min-w-[150px]">{t('policies.insurer')}</TableHead>
              <TableHead className="min-w-[200px]">{t('policies.policyDetails')}</TableHead>
              <TableHead className="min-w-[100px]">{t('policies.premium')}</TableHead>
              <TableHead className="min-w-[100px]">{t('policies.status')}</TableHead>
              <TableHead className="min-w-[100px]">{t('policies.expiry')}</TableHead>
              <TableHead className="min-w-[100px]">{t('policies.daysLeft')}</TableHead>
              <TableHead >{t('policies.pdf')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((policy) => {
                const isExpandable =
                  EXPANDABLE_TYPES.includes(policy.type) &&
                  policy.insuredPersons &&
                  policy.insuredPersons.length > 0
                const isExpanded = expandedRows.has(policy.id)
                const persons = policy.insuredPersons || []

                return (
                  <Fragment key={policy.id}>
                    {/* Parent row */}
                    <TableRow
                      className={cn(
                        'transition-colors cursor-pointer hover:bg-gray-50',
                        isExpanded && 'bg-green-50/40 border-b-0'
                      )}
                      onClick={() =>
                        isExpandable
                          ? toggleRow(policy.id)
                          : navigate(`/policies/${policy.id}`)
                      }
                    >
                      <TableCell className="w-10 px-3">
                        {isExpandable ? (
                          <div className="flex items-center gap-1">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-accent-green" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{policy.policyNumber}</span>
                          {isExpandable && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                              <Users className="h-3 w-3" />
                              {persons.length}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <InsuranceTypeBadge type={policy.type} />
                      </TableCell>
                      <TableCell>{policy.insurerName}</TableCell>
                      <TableCell>
                        <span className="max-w-[220px] truncate block">
                          {getPolicyDetailsDisplay(policy)}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(policy.premium)}</TableCell>
                      <TableCell>
                        <PolicyStatusBadge status={policy.status} />
                      </TableCell>
                      <TableCell>{formatDate(policy.endDate)}</TableCell>
                      <TableCell>
                        {policy.status === 'ACTIVE' ? (
                          <ExpiryBadge days={policy.daysUntilExpiry} t={t} />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        {!isExpandable && (() => {
                          const doc = policy.documents.find((d) => d.type === 'POLICY')
                          return doc ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(doc.url, '_blank')
                              }}
                            >
                              <Download className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          ) : null
                        })()}
                      </TableCell>
                    </TableRow>

                    {/* Sub-rows: insured persons */}
                    {isExpandable && isExpanded &&
                      persons.map((person, idx) => {
                        const isLast = idx === persons.length - 1

                        return (
                          <TableRow
                            key={`${policy.id}-p-${idx}`}
                            className={cn(
                              'bg-gray-50/70 hover:bg-gray-100/50 cursor-pointer',
                              !isLast && 'border-b border-dashed border-gray-200',
                              isLast && 'border-b-2 border-gray-200'
                            )}
                            onClick={() => navigate(`/policies/${policy.id}`)}
                          >
                            {/* Tree connector */}
                            <TableCell className="w-10 px-3 relative">
                              <div className="flex items-center justify-center">
                                <div
                                  className={cn(
                                    'absolute left-1/2 w-px bg-green-300',
                                    isLast ? 'top-0 h-1/2' : 'top-0 h-full'
                                  )}
                                />
                                <div className="absolute left-1/2 top-1/2 h-px w-3 bg-green-300" />
                                <div className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                                  <User className="h-3 w-3 text-green-600" />
                                </div>
                              </div>
                            </TableCell>
                            {/* Name */}
                            <TableCell>
                              <span className="text-sm font-medium text-gray-800">
                                {person.name}
                              </span>
                            </TableCell>
                            {/* Role in Tip column */}
                            <TableCell>
                              {person.role && (
                                <Badge
                                  variant="outline"
                                  className="border-green-200 bg-green-50 text-green-700 text-xs font-normal"
                                >
                                  {person.role}
                                </Badge>
                              )}
                            </TableCell>
                            {/* CNP in Asigurător column */}
                            <TableCell>
                              {person.cnp && (
                                <span className="text-xs text-gray-500 font-mono">
                                  {person.cnp}
                                </span>
                              )}
                            </TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell>
                              {person.documentUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(person.documentUrl, '_blank')
                                  }}
                                >
                                  <Download className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </Fragment>
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

function ExpiryBadge({ days, t }: { days: number; t: (key: string, opts?: Record<string, unknown>) => string }) {
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
