import { DataTable } from '@/components/data-table/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Quote, QuoteStatus, TableParams } from '@/api/types'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useQuotes } from '@/hooks/use-quotes'
import i18n from '@/lib/i18n'
import { formatCurrency } from '@/lib/utils'

const getSimplifiedStatus = (status: QuoteStatus) => {
  if (status === 'expired') {
    return {
      labelKey: 'quoteStatus.EXPIRED',
      dot: 'bg-red-500',
      text: 'text-red-600'
    }
  }
  return {
    labelKey: 'quoteStatus.ACTIVE',
    dot: 'bg-accent-green',
    text: 'text-accent-green'
  }
}

const filterConfigs = [
  {
    key: 'type',
    labelKey: 'policies.type',
    options: [
      { value: 'rca', labelKey: 'insuranceTypes.rca' },
      { value: 'casco', labelKey: 'insuranceTypes.casco' },
      { value: 'home', labelKey: 'insuranceTypes.home' },
      { value: 'travel', labelKey: 'insuranceTypes.travel' },
      { value: 'health', labelKey: 'insuranceTypes.health' },
      { value: 'life', labelKey: 'insuranceTypes.life' },
      { value: 'other', labelKey: 'insuranceTypes.other' }
    ]
  },
  {
    key: 'status',
    labelKey: 'policies.status',
    options: [
      { value: 'active', labelKey: 'quoteStatus.ACTIVE' },
      { value: 'expired', labelKey: 'quoteStatus.EXPIRED' }
    ]
  }
]

export function QuotesTable() {
  const { t } = useTranslation()
  const [params, setParams] = useState<TableParams>({
    page: 1,
    limit: 9999,
    sort: 'createdAt',
    order: 'desc',
    search: ''
  })

  const [dateFrom, _setDateFrom] = useState('')
  const [dateTo, _setDateTo] = useState('')

  const { data, isLoading, isError } = useQuotes(params)

  const filteredData = useMemo(() => {
    if (!data?.data) return []
    let items = data.data

    if (dateFrom) {
      const from = new Date(dateFrom)
      items = items.filter((q) => new Date(q.createdAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      items = items.filter((q) => new Date(q.createdAt) <= to)
    }

    return items
  }, [data?.data, dateFrom, dateTo])

  const columns: ColumnDef<Quote>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('quotes.quoteRef')} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.id}</span>
      )
    },
    {
      accessorKey: 'type',
      header: t('policies.type'),
      cell: ({ row }) => <InsuranceTypeBadge type={row.original.type} />
    },
    {
      accessorKey: 'premium',
      header: t('quotes.premium'),
      cell: ({ row }) => (
        <span>
          {row.original.premium != null
            ? formatCurrency(row.original.premium)
            : '—'}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: t('policies.status'),
      cell: ({ row }) => {
        const config = getSimplifiedStatus(row.original.status)
        return (
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${config.dot}`} />
            <span className={`text-sm font-medium ${config.text}`}>
              {t(config.labelKey)}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('quotes.dateTime')} />
      ),
      cell: ({ row }) => {
        const localeMap: Record<string, string> = {
          ro: 'ro-RO',
          hu: 'hu-HU',
          en: 'en-US'
        }
        const locale = localeMap[i18n.language] || 'en-US'
        const d = new Date(row.original.createdAt)
        return (
          <div className="leading-tight">
            <div className="text-sm text-gray-900">
              {d.toLocaleDateString(locale, {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="text-xs text-gray-400">
              {d.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <span className="text-sm text-muted-foreground">—</span>
      )
    }
  ]

  const handleFilterChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value === 'ALL' ? undefined : value
    }))
  }

  // const hasActiveFilters =
  //   (params.filters && Object.values(params.filters).some(Boolean)) ||
  //   dateFrom ||
  //   dateTo

  // const handleClearFilters = () => {
  //   setParams((prev) => ({ ...prev, filters: {} }))
  //   setDateFrom('')
  //   setDateTo('')
  // }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {filterConfigs.map((config) => (
            <Select
              key={config.key}
              value={(params as unknown as Record<string, string | undefined>)[config.key] || 'ALL'}
              onValueChange={(value) => handleFilterChange(config.key, value)}
            >
              <SelectTrigger className="h-9 w-[140px]">
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
        </div>

        {/* <div className="flex items-center gap-1.5">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 w-[140px]"
          />
          <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 w-[140px]"
          />

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
        </div> */}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
