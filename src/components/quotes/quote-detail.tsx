import type { QuoteStatus } from '@/api/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuote } from '@/hooks/use-quotes'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  ArrowLeft,
  Banknote,
  Building2,
  Calendar,
  CalendarRange,
  FileText,
  Shield
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

const typeConfig: Record<
  string,
  { badge: string; iconBg: string; iconText: string }
> = {
  rca: {
    badge: 'bg-green-100 text-green-700',
    iconBg: 'bg-green-50',
    iconText: 'text-green-600'
  },
  casco: {
    badge: 'bg-green-100 text-green-700',
    iconBg: 'bg-green-50',
    iconText: 'text-green-600'
  },
  home: {
    badge: 'bg-orange-100 text-orange-700',
    iconBg: 'bg-orange-50',
    iconText: 'text-orange-600'
  },
  health: {
    badge: 'bg-rose-100 text-rose-700',
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-600'
  },
  travel: {
    badge: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-50',
    iconText: 'text-purple-600'
  },
  life: {
    badge: 'bg-pink-100 text-pink-700',
    iconBg: 'bg-pink-50',
    iconText: 'text-pink-600'
  },
  other: {
    badge: 'bg-gray-100 text-gray-700',
    iconBg: 'bg-gray-50',
    iconText: 'text-gray-600'
  }
}

const statusConfig: Record<
  QuoteStatus,
  { labelKey: string; dot: string; text: string }
> = {
  draft: {
    labelKey: 'quoteStatus.DRAFT',
    dot: 'bg-gray-400',
    text: 'text-gray-500'
  },
  submitted: {
    labelKey: 'quoteStatus.SUBMITTED',
    dot: 'bg-blue-500',
    text: 'text-blue-600'
  },
  accepted: {
    labelKey: 'quoteStatus.ACCEPTED',
    dot: 'bg-accent-green',
    text: 'text-accent-green'
  },
  expired: {
    labelKey: 'quoteStatus.EXPIRED',
    dot: 'bg-red-500',
    text: 'text-red-600'
  },
  converted: {
    labelKey: 'quoteStatus.CONVERTED',
    dot: 'bg-purple-500',
    text: 'text-purple-600'
  }
}

const defaultType = {
  badge: 'bg-gray-100 text-gray-600',
  iconBg: 'bg-gray-50',
  iconText: 'text-gray-600'
}

export function QuoteDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: quote, isLoading, isError } = useQuote(id!)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-12 w-full rounded-lg" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isError || !quote) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg font-medium">{t('quotes.notFound')}</p>
        <Button asChild={true} variant="outline">
          <Link to="/quotes">{t('quotes.backToQuotes')}</Link>
        </Button>
      </div>
    )
  }

  const type = typeConfig[quote.type] || defaultType
  const status = statusConfig[quote.status]
  const typeLabel = t(`insuranceType.${quote.type}`)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild={true}
          className="shrink-0 self-start"
        >
          <Link to="/quotes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {quote.id}
            </h1>
            <span
              className={cn(
                'inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold',
                type.badge
              )}
            >
              {typeLabel}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {t('quotes.quoteType', { type: typeLabel })}
          </p>
        </div>
        <span
          className={cn(
            'flex items-center gap-1.5 text-sm font-medium shrink-0',
            status.text
          )}
        >
          <span className={cn('h-2 w-2 rounded-full', status.dot)} />
          {t(status.labelKey)}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Details Card */}
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md shrink-0',
                    type.iconBg
                  )}
                >
                  <Shield className={cn('h-5 w-5', type.iconText)} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {t('quotes.detailsTitle')}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t('quotes.detailsSubtitle')}
                  </p>
                </div>
              </div>

              {/* Premium - Hero Metric */}
              <div
                className={cn(
                  'flex items-center gap-4 rounded-xl p-4 border',
                  type.badge.split(' ')[0],
                  'border-transparent'
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Banknote className={cn('h-5 w-5', type.iconText)} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('quotes.insurancePremium')}
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">
                    {quote.premium != null ? formatCurrency(quote.premium) : '—'}
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Building2 className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('quotes.type')}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                      {typeLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                {quote.validUntil && (
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                      <CalendarRange className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('quotes.validUntil')}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {formatDate(quote.validUntil)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('quotes.createdDate')}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {formatDate(quote.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {t('quotes.documents')}
                </CardTitle>
                <CardDescription>
                  {t('quotes.documentsSubtitle')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('policies.noDocuments')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
