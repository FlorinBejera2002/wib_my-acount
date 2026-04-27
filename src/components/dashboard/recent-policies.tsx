import type { PolicyStatus } from '@/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { usePolicies } from '@/hooks/use-policies'
import { cn } from '@/lib/utils'
import type { TFunction } from 'i18next'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
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

export function RecentPolicies() {
  const { t } = useTranslation()
  const { data, isLoading } = usePolicies({
    page: 1,
    limit: 50,
    sort: 'createdAt',
    order: 'desc'
  })

  const sortedPolicies = useMemo(() => {
    if (!data?.data) return []

    const policies = [...data.data]

    // Separate policies by status
    const pending = policies.filter((p) => p.status === 'pending')
    const active = policies.filter((p) => p.status === 'active')
    const expired = policies.filter((p) => p.status === 'expired')

    const result = []
    let slotsRemaining = 5

    // Add pending policies first
    const pendingToAdd = pending.slice(0, slotsRemaining)
    result.push(...pendingToAdd)
    slotsRemaining -= pendingToAdd.length

    // Add active policies if there's space
    if (slotsRemaining > 0) {
      const activeToAdd = active.slice(0, slotsRemaining)
      result.push(...activeToAdd)
      slotsRemaining -= activeToAdd.length
    }

    // Add expired policies if there's still space
    if (slotsRemaining > 0) {
      const expiredToAdd = expired.slice(0, slotsRemaining)
      result.push(...expiredToAdd)
    }

    return result
  }, [data?.data])

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
        ) : sortedPolicies.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-400">
            {t('dashboard.noPolicies')}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sortedPolicies.map((policy) => {
              const status = getStatusConfig(policy.status, t)
              return (
                <li key={policy.id}>
                  <Link
                    to={`/policies?policyId=${policy.id}`}
                    className="flex items-center gap-3 px-4 sm:px-6 py-3.5 transition-colors hover:bg-gray-50"
                  >
                    <InsuranceTypeBadge type={policy.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {policy.policyNumber}
                      </p>
                      <span className="text-sm text-gray-700 max-w-[230px] truncate block">
                        {policy.policyDetails ??
                          policy.vehicleOrProperty ??
                          policy.insurer ??
                          '—'}
                      </span>
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
