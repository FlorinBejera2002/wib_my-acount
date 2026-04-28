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
import { Skeleton } from '@/components/ui/skeleton'
import { useQuotes } from '@/hooks/use-quotes'
import { formatDate } from '@/lib/utils'
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Inbox,
  Plus
} from 'lucide-react'

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
      {
        value: 'accidents_traveler',
        labelKey: 'insuranceType.ACCIDENTS_TRAVELER'
      },
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

const quoteFormUrls: Record<string, string> = {
  rca: 'https://www.asigurari.ro/app/broker/cotatie/rca/vehicle',
  casco: 'https://www.asigurari.ro/app/broker/cotatie/casco/vehicle',
  casco_econom:
    'https://www.asigurari.ro/app/broker/cotatie/casco_econom/vehicle',
  pad: 'https://www.asigurari.ro/app/broker/cotatie/pad/insurance',
  home: 'https://www.asigurari.ro/forms/home',
  travel: 'https://www.asigurari.ro/app/broker/cotatie/travel/insurance',
  breakdown: 'https://www.asigurari.ro/app/broker/cotatie/breakdown/vehicle',
  health: 'https://www.asigurari.ro/app/broker/cotatie/health/insurance',
  rcp: 'https://www.asigurari.ro/app/broker/cotatie/rcp/insurance',
  cmr: 'https://www.asigurari.ro/app/broker/cotatie/cmr/insured',
  accidents: 'https://www.asigurari.ro/app/broker/cotatie/accidents/insured',
  accidents_taxi:
    'https://www.asigurari.ro/app/broker/cotatie/accidents_taxi/insured',
  accidents_traveler:
    'https://www.asigurari.ro/app/broker/cotatie/accidents_traveler/insured'
}

/* ── Hover-expandable text cell for desktop table ── */
function ExpandableCell({ text }: { text: string }) {
  if (text.length <= 40) {
    return <span className="text-sm text-gray-700">{text}</span>
  }
  return (
    <div className="relative group/cell">
      <span className="text-sm text-gray-700 block max-w-[220px] truncate cursor-default">
        {text}
      </span>
      <div className="invisible opacity-0 group-hover/cell:visible group-hover/cell:opacity-100 transition-all duration-200 absolute z-50 left-0 top-full mt-1 max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-lg whitespace-normal">
        {text}
      </div>
    </div>
  )
}

/* ── Main export ── */

export function QuotesTable() {
  const { t } = useTranslation()
  const [params, setParams] = useState<TableParams>({
    page: 1,
    limit: 9999,
    sort: 'createdAt',
    order: 'desc',
    search: ''
  })

  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  )
  const [dateFrom, _setDateFrom] = useState('')
  const [dateTo, _setDateTo] = useState('')

  const { data, isLoading, isError } = useQuotes(params)

  const filteredData = useMemo(() => {
    if (!data?.data) return []
    let items = data.data
    if (statusFilter === 'active') {
      items = items.filter((q) => q.status !== 'expired')
    } else if (statusFilter === 'expired') {
      items = items.filter((q) => q.status === 'expired')
    }
    if (dateFrom) {
      const from = new Date(dateFrom)
      items = items.filter((q) => new Date(q.createdAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      items = items.filter((q) => new Date(q.createdAt) <= to)
    }
    return items.sort((a, b) => {
      const aExpired = a.status === 'expired'
      const bExpired = b.status === 'expired'
      if (aExpired === bExpired) return 0
      if (aExpired && !bExpired) return 1
      return -1
    })
  }, [data?.data, statusFilter, dateFrom, dateTo])

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
      cell: ({ row }) => {
        const text =
          row.original.productDetails ?? row.original.vehicleOrProperty ?? '—'
        return <ExpandableCell text={text} />
      }
    },
    {
      accessorKey: 'insuredDetails',
      header: t('quotes.insuredDetails'),
      cell: ({ row }) => {
        const text = row.original.insuredDetails ?? '—'
        return <ExpandableCell text={text} />
      }
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
        if (!url)
          return <span className="text-sm text-muted-foreground">—</span>
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

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') {
      setStatusFilter(value === 'ALL' ? undefined : value)
    } else {
      setParams((prev) => ({
        ...prev,
        [key]: value === 'ALL' ? undefined : value
      }))
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 pb-4">
        {filterConfigs.map((config) => (
          <Select
            key={config.key}
            value={
              config.key === 'status'
                ? statusFilter || 'ALL'
                : (params as unknown as Record<string, string | undefined>)[
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
      </div>

      {/* ═══ Mobile / Tablet card list (< lg) ═══ */}
      <div className="flex flex-col gap-5 lg:hidden">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-100/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] py-16">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="font-medium text-foreground">{t('common.error')}</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} t={t} />
          ))
        ) : (
          <EmptyQuotes typeFilter={params.type} t={t} />
        )}
      </div>

      {/* ═══ Desktop table (lg+) ═══ */}
      <div className="hidden lg:block">
        {!isLoading && !isError && filteredData.length === 0 ? (
          <EmptyQuotes typeFilter={params.type} t={t} />
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            isError={isError}
          />
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  QuoteCard – mobile / tablet (< lg)                                   */
/* ═══════════════════════════════════════════════════════════════════════ */

function ExpandableText({
  label,
  text,
  t
}: {
  label: string
  text: string
  t: (key: string) => string
}) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > 50

  return (
    <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5 col-span-2">
      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm font-semibold text-gray-800 ${!expanded && isLong ? 'line-clamp-2' : ''}`}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-0.5 text-[11px] text-blue-500 font-medium mt-1"
        >
          {expanded ? (
            <>
              {t('common.showLess')}
              <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              {t('common.showMore')}
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  )
}

function QuoteCard({
  quote,
  t
}: {
  quote: Quote
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  const config = getSimplifiedStatus(quote.status)

  return (
    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-100/60">
        <span className="font-bold text-gray-900 text-sm truncate">
          {quote.quoteNumber ?? quote.id}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
          <span className={`text-xs font-medium ${config.text}`}>
            {t(config.labelKey)}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 py-4">
        {/* Type badge */}
        <InsuranceTypeBadge
          type={quote.type}
          className="px-2 py-0.5 text-[11px] gap-1 [&_svg]:h-3 [&_svg]:w-3"
        />

        {/* Mini-cards grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {/* Date */}
          <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5 col-span-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('quotes.dateTime')}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(quote.createdAt)}
            </p>
          </div>

          {/* Product details — expandable, full width */}
          {(quote.productDetails ?? quote.vehicleOrProperty) && (
            <ExpandableText
              label={t('quotes.productDetails')}
              text={(quote.productDetails ?? quote.vehicleOrProperty) as string}
              t={t}
            />
          )}

          {/* Insured details — expandable, full width */}
          {quote.insuredDetails && (
            <ExpandableText
              label={t('quotes.insuredDetails')}
              text={quote.insuredDetails}
              t={t}
            />
          )}
        </div>

        {/* Offer link */}
        {quote.offerUrl && (
          <div className="mt-4">
            <a
              href={quote.offerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-900"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              {t('quotes.viewOffer')}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  EmptyQuotes – empty state with quote CTA                             */
/* ═══════════════════════════════════════════════════════════════════════ */

function EmptyQuotes({
  typeFilter,
  t
}: {
  typeFilter?: string
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  const quoteUrl = typeFilter
    ? quoteFormUrls[typeFilter]
    : 'https://www.asigurari.ro'

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-100/80 bg-white py-16 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <Inbox className="h-10 w-10 text-muted-foreground/50" />
      <p className="text-muted-foreground">{t('common.noResults')}</p>
      {quoteUrl && (
        <a
          href={quoteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800/90"
        >
          <Plus className="h-4 w-4" />
          {t('common.newQuote')}
        </a>
      )}
    </div>
  )
}
