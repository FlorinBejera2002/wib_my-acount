import type { PolicyStatus } from '@/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePolicies } from '@/hooks/use-policies'
import { cn } from '@/lib/utils'
import type { TFunction } from 'i18next'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const statusConfig: Record<
  PolicyStatus,
  { label: string; dot: string; text: string }
> = {
  active: {
    label: 'Activă',
    dot: 'bg-accent-green',
    text: 'text-accent-green'
  },
  expired: {
    label: 'Expirată',
    dot: 'bg-red-500',
    text: 'text-red-600'
  },
  cancelled: {
    label: 'Anulată',
    dot: 'bg-gray-500',
    text: 'text-gray-600'
  },
  pending: {
    label: 'În așteptare',
    dot: 'bg-orange-500',
    text: 'text-orange-600'
  }
}

const typeConfig: Record<string, { label: string; className: string }> = {
  rca: { label: 'RCA', className: 'bg-blue-100 text-blue-700' },
  casco: { label: 'CASCO', className: 'bg-green-100 text-green-700' },
  home: { label: 'Locuință', className: 'bg-orange-100 text-orange-700' },
  health: { label: 'Sănătate', className: 'bg-rose-100 text-rose-700' },
  travel: { label: 'Călătorie', className: 'bg-purple-100 text-purple-700' },
  life: { label: 'Viață', className: 'bg-pink-100 text-pink-700' },
  other: { label: 'Altele', className: 'bg-gray-100 text-gray-700' }
}

function formatDaysUntilExpiry(days: number, t: TFunction): string {
  if (days < 0) return t('dashboard.expired')
  if (days === 0) return t('dashboard.expiresToday')
  if (days === 1) return t('dashboard.expiresTomorrow')
  return t('dashboard.daysRemaining', { days })
}

export function RecentPolicies() {
  const { t } = useTranslation()
  const { data, isLoading } = usePolicies({
    page: 1,
    limit: 5,
    sort: 'createdAt',
    order: 'desc'
  })

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          {t('dashboard.recentPolicies')}
        </CardTitle>
        <Link
          to="/policies"
          className="flex items-center gap-1 text-xs font-medium text-accent-green hover:text-accent-green-hover transition-colors"
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
            {t('dashboard.noPolicies')}
          </p>
        ) : (
          <ul>
            {data?.data.map((policy, i) => {
              const status = statusConfig[policy.status] ?? statusConfig.active
              const isLast = i === (data?.data.length ?? 0) - 1
              const type = typeConfig[policy.type] || {
                label: policy.type,
                className: 'bg-gray-100 text-gray-600'
              }

              return (
                <li key={policy.id}>
                  <Link
                    to={`/policies/${policy.id}`}
                    className={cn(
                      'flex items-center gap-3 px-4 sm:px-6 py-3 transition-colors hover:bg-gray-50',
                      !isLast && 'border-b border-gray-100'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 max-w-[130px] truncate px-2 shrink-0 items-center justify-center rounded-lg text-xs font-semibold',
                        type.className
                      )}
                    >
                      {type.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {policy.policyNumber}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {policy.insurer ?? '—'}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
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
                      {policy.status === 'active' && (() => {
                        const daysLeft = Math.ceil((new Date(policy.endDate).getTime() - Date.now()) / 86400000)
                        return (
                          <span
                            className={cn(
                              'text-[11px] hidden sm:block',
                              daysLeft <= 30
                                ? 'font-medium text-amber-600'
                                : 'text-gray-400'
                            )}
                          >
                            {formatDaysUntilExpiry(daysLeft, t)}
                          </span>
                        )
                      })()}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 hidden sm:block" />
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
