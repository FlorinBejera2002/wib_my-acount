import type { QuoteStatus } from '@/api/types'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuotes } from '@/hooks/use-quotes'
import { cn, formatCurrency } from '@/lib/utils'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function getQuoteStatusConfig(status: QuoteStatus, t: TFunction) {
  if (status === 'expired') {
    return {
      label: t('quoteStatus.EXPIRED'),
      dot: 'bg-red-500',
      text: 'text-red-600'
    }
  }
  return {
    label: t('quoteStatus.ACTIVE'),
    dot: 'bg-accent-green',
    text: 'text-accent-green'
  }
}

export function RecentQuotes() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuotes({
    page: 1,
    limit: 5,
    sort: 'createdAt',
    order: 'desc'
  })

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          {t('dashboard.recentQuotes')}
        </CardTitle>
        <Link
          to="/quotes"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t('common.viewAll')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="space-y-1 px-6 pb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-400">
            {t('dashboard.noQuotes')}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data?.data.map((quote) => {
              const status = getQuoteStatusConfig(quote.status, t)

              return (
                <li key={quote.id}>
                  <Link
                    to={`/quotes/${quote.id}`}
                    className="flex items-center gap-3 px-4 sm:px-6 py-3.5 transition-colors hover:bg-gray-50"
                  >
                    <InsuranceTypeBadge type={quote.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {quote.id}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {quote.premium != null
                          ? formatCurrency(quote.premium)
                          : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          'flex items-center gap-1.5 text-xs font-medium',
                          status.text
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full shrink-0',
                            status.dot
                          )}
                        />
                        <span className="hidden sm:inline">{status.label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300 hidden sm:block" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
