import { DataTable } from '@/components/data-table/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import type { Quote, QuoteStatus, TableParams } from '@/api/types'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Input } from '@/components/ui/input'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { useQuotes } from '@/hooks/use-quotes'
import { formatDateTime } from '@/lib/utils'
import { ArrowRight, ExternalLink, Search, X } from 'lucide-react'

const statusConfig: Record<
  QuoteStatus,
  { label: string; dot: string; text: string }
> = {
  ACTIVE: {
    label: 'Activă',
    dot: 'bg-accent-green',
    text: 'text-accent-green'
  },
  EXPIRED: {
    label: 'Expirată',
    dot: 'bg-red-500',
    text: 'text-red-600'
  },
  CONVERTED: {
    label: 'Acceptată',
    dot: 'bg-purple-500',
    text: 'text-purple-600'
  },
  DRAFT: {
    label: 'Schiță',
    dot: 'bg-gray-400',
    text: 'text-gray-500'
  }
}


export function QuotesTable() {
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
        <DataTableColumnHeader column={column} title="Referință cotație" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.quoteNumber}</span>
      )
    },
    {
      accessorKey: 'type',
      header: 'Tip',
      cell: ({ row }) => <InsuranceTypeBadge type={row.original.type} />
    },
    {
      accessorKey: 'vehicleOrProperty',
      header: 'Obiect asigurat',
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate block">
          {row.original.vehicleOrProperty || '—'}
        </span>
      )
    },
    {
      accessorKey: 'insuredDetails',
      header: 'Detalii asigurat',
      cell: ({ row }) => (
        <span className="max-w-[220px] truncate block">
          {row.original.insuredDetails || '—'}
        </span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config = statusConfig[row.original.status]
        return (
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${config.dot}`} />
            <span className={`text-sm font-medium ${config.text}`}>
              {config.label}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dată + oră" />
      ),
      cell: ({ row }) => {
        const d = new Date(row.original.createdAt)
        return (
          <div className="leading-tight">
            <div className="text-sm text-gray-900">
              {d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-xs text-gray-400">
              {d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
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
          Vezi oferta
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
            placeholder="Caută..."
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
            Resetează
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
