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
  ChevronDown,
  ChevronRight,
  Download,
  Inbox,
  Search,
  User,
  Users,
  X
} from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Policy, TableParams } from '@/api/types'
import { PolicyStatusBadge } from './policy-status-badge'

const EXPANDABLE_TYPES = [
  'CALATORIE',
  'LOCUINTA_PAD',
  'LOCUINTA_FACULTATIVA'
]

const filterConfigs = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Activ', value: 'ACTIVE' },
      { label: 'Expirat', value: 'EXPIRED' },
      { label: 'Anulat', value: 'CANCELLED' },
      { label: 'În așteptare', value: 'PENDING' }
    ]
  },
  {
    key: 'type',
    label: 'Tip',
    options: [
      { label: 'RCA', value: 'RCA' },
      { label: 'CASCO', value: 'CASCO' },
      { label: 'CASCO Econom', value: 'CASCO_ECONOM' },
      { label: 'Locuință PAD', value: 'LOCUINTA_PAD' },
      { label: 'Locuință Facultativă', value: 'LOCUINTA_FACULTATIVA' },
      { label: 'Călătorie', value: 'CALATORIE' },
      { label: 'Asistență Rutieră', value: 'ASISTENTA_RUTIERA' },
      { label: 'Malpraxis', value: 'MALPRAXIS' },
      { label: 'Sănătate', value: 'SANATATE' },
      { label: 'Accidente Călători', value: 'ACCIDENTE_CALATORI' },
      { label: 'Accidente Persoane', value: 'ACCIDENTE_PERSOANE' },
      { label: 'Accidente Taxi', value: 'ACCIDENTE_TAXI' },
      { label: 'CMR', value: 'CMR' },
      { label: 'Viață', value: 'VIATA' }
    ]
  }
]

function ExpiryBadge({ days }: { days: number }) {
  if (days < 0) return null
  if (days <= 7) {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">
        {days} zile
      </Badge>
    )
  }
  if (days <= 30) {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
        {days} zile
      </Badge>
    )
  }
  return <span className="text-sm text-muted-foreground">{days} zile</span>
}

export function PoliciesTable() {
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

  const handleSearchChange = (search: string) => {
    setParams((prev) => ({ ...prev, search }))
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
    params.search ||
    dateFrom ||
    dateTo ||
    Object.values(params.filters || {}).some((v) => v && v !== 'ALL')

  const handleClearFilters = () => {
    setParams((prev) => ({
      ...prev,
      search: '',
      filters: {}
    }))
    setDateFrom('')
    setDateTo('')
  }

  const colCount = 10

  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-[140px]" />
        </div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <Table>
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
            A apărut o eroare la încărcarea datelor
          </p>
          <p className="text-sm text-muted-foreground">
            Te rugăm să încerci din nou
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută..."
            value={params.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterConfigs.map((config) => (
            <Select
              key={config.key}
              value={params.filters?.[config.key] || 'ALL'}
              onValueChange={(value) => handleFilterChange(config.key, value)}
            >
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder={config.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toate ({config.label})</SelectItem>
                {config.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Expirare de la</span>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 w-[150px]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Până la</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 w-[150px]"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-9 px-2"
            >
              <X className="mr-1 h-4 w-4" />
              Șterge filtre
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-green-50">
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Referință poliță</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Asigurător</TableHead>
              <TableHead>Detalii poliță</TableHead>
              <TableHead>Primă</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expirare</TableHead>
              <TableHead>Zile rămase</TableHead>
              <TableHead>PDF</TableHead>
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
                          {policy.policyDetails || '—'}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(policy.premium)}</TableCell>
                      <TableCell>
                        <PolicyStatusBadge status={policy.status} />
                      </TableCell>
                      <TableCell>{formatDate(policy.endDate)}</TableCell>
                      <TableCell>
                        {policy.status === 'ACTIVE' ? (
                          <ExpiryBadge days={policy.daysUntilExpiry} />
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
                      Nu au fost găsite rezultate
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
