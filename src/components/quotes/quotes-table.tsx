import { DataTable } from '@/components/data-table/data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Quote, TableParams } from '@/api/types'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { useQuotes } from '@/hooks/use-quotes'
import { formatCurrency, formatDate } from '@/lib/utils'

const filterConfigs = [
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

export function QuotesTable() {
  const navigate = useNavigate()
  const [params, setParams] = useState<TableParams>({
    page: 1,
    limit: 9999,
    sort: 'createdAt',
    order: 'desc',
    search: '',
    filters: {}
  })

  const { data, isLoading, isError } = useQuotes(params)

  const columns: ColumnDef<Quote>[] = [
    {
      accessorKey: 'quoteNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Număr cotație" />
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
      accessorKey: 'insurerName',
      header: 'Asigurător'
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
      accessorKey: 'premium',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Primă" />
      ),
      cell: ({ row }) => formatCurrency(row.original.premium)
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dată creare" />
      ),
      cell: ({ row }) => formatDate(row.original.createdAt)
    }
  ]

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

  const handleClearFilters = () => {
    setParams((prev) => ({
      ...prev,
      search: '',
      filters: {}
    }))
  }

  return (
    <div>
      <DataTableToolbar
        search={params.search || ''}
        onSearchChange={handleSearchChange}
        filters={params.filters || {}}
        onFilterChange={handleFilterChange}
        filterConfigs={filterConfigs}
        onClearFilters={handleClearFilters}
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        onRowClick={(row: Quote) => navigate(`/quotes/${row.id}`)}
      />
    </div>
  )
}
