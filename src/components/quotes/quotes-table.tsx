import { DataTable } from '@/components/data-table/data-table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Quote, TableParams } from '@/api/types'
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
import { useGetQuoteOfferUrl, useQuotes } from '@/hooks/use-quotes'
import { formatDate } from '@/lib/utils'
import { AlertCircle, ExternalLink, Inbox, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

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

const snakeToCamel = (key: string) =>
  key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

function getProductEntries(quote: Quote): [string, string][] {
  const product = quote.data?.product
  if (!product || Array.isArray(product)) return []
  return Object.entries(product as Record<string, unknown>)
    .filter(
      ([key, val]) =>
        key !== 'system' && val !== null && val !== undefined && val !== ''
    )
    .map(([key, val]) => [key, String(val)])
}

function getInsuredEntries(quote: Quote): [string, string][] {
  const insured = quote.data?.insured
  if (!insured || Array.isArray(insured)) return []
  return Object.entries(insured as Record<string, unknown>)
    .filter(
      ([key, val]) =>
        key !== 'system' && val !== null && val !== undefined && val !== ''
    )
    .map(([key, val]) => [key, String(val)])
}

function ProductDetailsCell({ quote }: { quote: Quote }) {
  const { t } = useTranslation()
  const entries = getProductEntries(quote)

  if (entries.length === 0) {
    return <span className="text-sm text-gray-400">—</span>
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
      return val
    })
    .join(' · ')

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
                {t(`policies.product.${snakeToCamel(key)}`, {
                  defaultValue: snakeToCamel(key)
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
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
                            return t('policies.product.house', { defaultValue: 'Casă' })
                          return val
                        })()
                      : val}
              </span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function InsuredDetailsCell({ quote }: { quote: Quote }) {
  const { t } = useTranslation()
  const entries = getInsuredEntries(quote)
  if (entries.length === 0) {
    return <span className="text-sm text-gray-400">—</span>
  }
  const summary = entries.map(([, val]) => val).join(' · ')
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
                {t(`policies.insured.${snakeToCamel(key)}`, {
                  defaultValue: snakeToCamel(key)
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                })}
                :
              </span>
              <span className="font-medium">{val}</span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

/* ── OfferUrlButton ── */

function OfferUrlButton({ quote }: { quote: Quote }) {
  const { t } = useTranslation()
  const getOfferUrl = useGetQuoteOfferUrl()

  if (!quote.quoteInputParamsId) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  return (
    <button
      type="button"
      disabled={getOfferUrl.isPending}
      onClick={() => {
        getOfferUrl.mutate(quote.quoteInputParamsId!, {
          onSuccess: ({ offerUrl }) => {
            if (offerUrl) {
              window.open(offerUrl, '_blank', 'noopener,noreferrer')
            } else {
              toast.info(t('quotes.noOfferUrl'))
            }
          }
        })
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-150 bg-gray-50/40 px-3 py-1.5 text-xs font-medium text-blue-600 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {getOfferUrl.isPending ? (
        <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
      ) : (
        <ExternalLink className="h-3 w-3 shrink-0" />
      )}
      {t('quotes.viewOffer')}
    </button>
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

  const { data, isLoading, isError } = useQuotes(params)
  const filteredData = data?.data ?? []

  const columns: ColumnDef<Quote>[] = [
    {
      accessorKey: 'quoteRef',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('quotes.quoteRef')} />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          {row.original.quoteRef ?? row.original.id}
        </span>
      )
    },
    {
      accessorKey: 'type',
      header: t('policies.type'),
      cell: ({ row }) => <InsuranceTypeBadge type={row.original.type} />
    },
    {
      id: 'productDetails',
      header: t('quotes.productDetails'),
      cell: ({ row }) => <ProductDetailsCell quote={row.original} />
    },
    {
      id: 'insuredDetails',
      header: t('quotes.insuredDetails'),
      cell: ({ row }) => <InsuredDetailsCell quote={row.original} />
    },
    {
      accessorKey: 'quoteStartDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('quotes.dateTime')} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-700">
            {formatDate(row.original.quoteStartDate ?? '')}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(row.original.quoteStartDate ?? '', 'HH:mm')}
          </span>
        </div>
      )
    },
    {
      id: 'offerUrl',
      header: t('quotes.viewOffer'),
      cell: ({ row }) => <OfferUrlButton quote={row.original} />
    }
  ]

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 pb-4">
        {filterConfigs.map((filter) => (
          <Select
            key={filter.key}
            value={params.type ?? 'all'}
            onValueChange={(val) =>
              setParams((prev) => ({
                ...prev,
                type: val === 'all' ? undefined : val,
                page: 1
              }))
            }
          >
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue placeholder={t(filter.labelKey)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              {filter.options.map((opt) => (
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

function QuoteCard({
  quote,
  t
}: {
  quote: Quote
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-100/60">
        <span className="font-bold text-gray-900 text-sm truncate">
          {quote.quoteRef ?? quote.id}
        </span>
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
              {formatDate(quote.quoteStartDate ?? '')}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(quote.quoteStartDate ?? '', 'HH:mm')}
            </p>
          </div>

          {/* Product details */}
          {getProductEntries(quote).length > 0 && (
            <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5 col-span-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
                {t('quotes.productDetails')}
              </p>
              <div className="space-y-0.5">
                {getProductEntries(quote).map(([key, val]) => (
                  <div key={key} className="flex gap-1.5 text-xs">
                    <span className="text-gray-400 shrink-0">
                      {t(`policies.product.${snakeToCamel(key)}`, {
                        defaultValue: snakeToCamel(key)
                          .replace(/([A-Z])/g, ' $1')
                          .trim()
                      })}
                      :
                    </span>
                    <span className="font-medium text-gray-800">
                      {key === 'destination'
                        ? t(`destination.${val}`, { defaultValue: val })
                        : key === 'purpose'
                          ? t(`purpose.${val}`, { defaultValue: val })
                          : key === 'vehicleType'
                            ? t(`vehicleType.${val}`, { defaultValue: val })
                            : val?.startsWith('malpraxis_')
                              ? t(`malpraxis.${val}`, { defaultValue: val })
                              : val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insured details */}
          {getInsuredEntries(quote).length > 0 && (
            <div className="rounded-lg bg-white border border-gray-100 px-3 py-2.5 col-span-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
                {t('quotes.insuredDetails')}
              </p>
              <div className="space-y-0.5">
                {getInsuredEntries(quote).map(([key, val]) => (
                  <div key={key} className="flex gap-1.5 text-xs">
                    <span className="text-gray-400 shrink-0">
                      {t(`policies.insured.${snakeToCamel(key)}`, {
                        defaultValue: snakeToCamel(key)
                          .replace(/([A-Z])/g, ' $1')
                          .trim()
                      })}
                      :
                    </span>
                    <span className="font-medium text-gray-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Offer link */}
        {quote.quoteInputParamsId && (
          <div className="mt-4">
            <OfferUrlButton quote={quote} />
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
