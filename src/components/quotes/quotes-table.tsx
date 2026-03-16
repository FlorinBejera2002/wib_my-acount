import { DataTable } from '@/components/data-table/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Quote, QuoteStatus, TableParams } from '@/api/types'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Input } from '@/components/ui/input'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { useQuotes } from '@/hooks/use-quotes'
import i18n from '@/lib/i18n'
import { formatDate, formatDateTime } from '@/lib/utils'
import { ArrowRight, ExternalLink, Search, X } from 'lucide-react'

const getSimplifiedStatus = (status: QuoteStatus) => {
  if (status === 'EXPIRED') {
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


export function QuotesTable() {
  const { t } = useTranslation()
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
        <span className="font-medium">{row.original.quoteNumber}</span>
      )
    },
    {
      accessorKey: 'type',
      header: t('policies.type'),
      cell: ({ row }) => <InsuranceTypeBadge type={row.original.type} />
    },
    {
      accessorKey: 'vehicleOrProperty',
      header: t('quotes.insuredObject'),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate block">
          {row.original.vehicleOrProperty || '—'}
        </span>
      )
    },
    {
      accessorKey: 'insuredDetails',
      header: t('quotes.insuredDetails'),
      cell: ({ row }) => (
        <span className="max-w-[220px] truncate block">
          {row.original.insuredDetails || '—'}
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
        const localeMap: Record<string, string> = { ro: 'ro-RO', hu: 'hu-HU', en: 'en-US' }
        const locale = localeMap[i18n.language] || 'en-US'
        const d = new Date(row.original.createdAt)
        return (
          <div className="leading-tight">
            <div className="text-sm text-gray-900">
              {d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-xs text-gray-400">
              {d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <a
          href={row.original.offerUrl || 'https://asigurari.ro'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-accent-green hover:text-accent-green-hover transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {t('quotes.viewOffer')}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )
    }
  ]

  const handleSearchChange = (search: string) => {
    setParams((prev) => ({ ...prev, search }))
  }

  const hasActiveFilters = params.search || dateFrom || dateTo

  const handleClearFilters = () => {
    setParams((prev) => ({ ...prev, search: '' }))
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t('common.search')}
            value={params.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

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
            {t('quotes.reset')}
          </button>
        )}
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
