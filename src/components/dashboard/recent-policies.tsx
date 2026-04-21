import type { PolicyStatus } from '@/api/types'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePolicies } from '@/hooks/use-policies'
import { cn } from '@/lib/utils'
import type { TFunction } from 'i18next'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function getStatusConfig(
  status: PolicyStatus,
  t: TFunction
): { label: string; dot: string; text: string } {
  switch (status) {
    case 'active':
      return {
        label: t('policyStatus.ACTIVE'),
        dot: 'bg-accent-green',
        text: 'text-accent-green'
      }
    case 'expired':
      return {
        label: t('policyStatus.EXPIRED'),
        dot: 'bg-red-500',
        text: 'text-red-600'
      }
    case 'cancelled':
      return {
        label: t('policyStatus.CANCELLED'),
        dot: 'bg-gray-500',
        text: 'text-gray-600'
      }
    case 'pending':
      return {
        label: t('policyStatus.PENDING'),
        dot: 'bg-orange-500',
        text: 'text-orange-600'
      }
    default:
      return {
        label: t('policyStatus.ACTIVE'),
        dot: 'bg-accent-green',
        text: 'text-accent-green'
      }
  }
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
            {t('dashboard.noPolicies')}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data?.data.map((policy) => {
              const status = getStatusConfig(policy.status, t)
              return (
                <li key={policy.id}>
                  <Link
                    to={`/policies/${policy.id}`}
                    className="flex items-center gap-3 px-4 sm:px-6 py-3.5 transition-colors hover:bg-gray-50"
                  >
                    <InsuranceTypeBadge type={policy.type} />
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
