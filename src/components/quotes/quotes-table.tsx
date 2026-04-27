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
import { formatDate } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

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
      { value: 'rca', labelKey: 'insuranceType.RCA' },
      { value: 'casco', labelKey: 'insuranceType.CASCO' },
      { value: 'casco_econom', labelKey: 'insuranceType.CASCO_ECONOM' },
      { value: 'home', labelKey: 'insuranceType.HOME' },
      { value: 'pad', labelKey: 'insuranceType.PAD' },
      { value: 'travel', labelKey: 'insuranceType.TRAVEL' },
      { value: 'health', labelKey: 'insuranceType.HEALTH' },
      { value: 'cmr', labelKey: 'insuranceType.CMR' },
      { value: 'rcp', labelKey: 'insuranceType.RCP' },
      { value: 'accidents', labelKey: 'insuranceType.ACCIDENTS' },
      { value: 'accidents_taxi', labelKey: 'insuranceType.ACCIDENTS_TAXI' },
      { value: 'accidents_traveler', labelKey: 'insuranceType.ACCIDENTS_TRAVELER' },
      { value: 'breakdown', labelKey: 'insuranceType.BREAKDOWN' }
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
      accessorKey: 'quoteNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('quotes.quoteRef')} />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          {row.original.quoteNumber ?? row.original.id}
        </span>
      )
    },
    {
      accessorKey: 'type',
      header: t('policies.type'),
      cell: ({ row }) => <InsuranceTypeBadge type={row.original.type} />
    },
    {
      accessorKey: 'productDetails',
      header: t('quotes.productDetails'),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700 max-w-[220px] truncate block">
          {row.original.productDetails ?? row.original.vehicleOrProperty ?? '—'}
        </span>
      )
    },
    {
      accessorKey: 'insuredDetails',
      header: t('quotes.insuredDetails'),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700 max-w-[200px] truncate block">
          {row.original.insuredDetails ?? '—'}
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
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {formatDate(row.original.createdAt)}
        </span>
      )
    },
    {
      id: 'offerUrl',
      header: t('quotes.viewOffer'),
      cell: ({ row }) => {
        const url = row.original.offerUrl
        if (!url) return <span className="text-sm text-muted-foreground">—</span>
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-150 bg-gray-50/40 px-3 py-1.5 text-xs font-medium text-blue-600 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 hover:text-blue-700"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            {t('quotes.viewOffer')}
          </a>
        )
      }
    }
  ]

  const handleFilterChange = (key: string, value: string) =>
    setParams((prev) => ({
      ...prev,
      [key]: value === 'ALL' ? undefined : value
    }))

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 pb-4">
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

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
