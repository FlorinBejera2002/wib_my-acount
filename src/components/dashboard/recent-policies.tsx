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
  CANCELLED: {
    label: 'Anulată',
    dot: 'bg-gray-500',
    text: 'text-gray-600'
  },
  TERMINATED: {
    label: 'Reziliată',
    dot: 'bg-orange-500',
    text: 'text-orange-600'
  }
}

const typeConfig: Record<string, { label: string; className: string }> = {
  RCA: { label: 'RCA', className: 'bg-blue-100 text-blue-700' },
  CASCO: { label: 'CASCO', className: 'bg-green-100 text-green-700' },
  CASCO_ECONOM: {
    label: 'CASCO Econom',
    className: 'bg-emerald-100 text-emerald-700'
  },
  LOCUINTA_PAD: {
    label: 'Locuință PAD',
    className: 'bg-orange-100 text-orange-700'
  },
  LOCUINTA_FACULTATIVA: {
    label: 'Locuință Facultativă',
    className: 'bg-amber-100 text-amber-700'
  },
  CALATORIE: { label: 'Călătorie', className: 'bg-purple-100 text-purple-700' },
  VIATA: { label: 'Viață', className: 'bg-pink-100 text-pink-700' },
  ASISTENTA_RUTIERA: {
    label: 'Asistență Rutieră',
    className: 'bg-sky-100 text-sky-700'
  },
  MALPRAXIS: { label: 'Malpraxis', className: 'bg-red-100 text-red-700' },
  SANATATE: { label: 'Sănătate', className: 'bg-rose-100 text-rose-700' },
  ACCIDENTE_CALATORI: {
    label: 'Accidente Călători',
    className: 'bg-indigo-100 text-indigo-700'
  },
  ACCIDENTE_PERSOANE: {
    label: 'Accidente Persoane',
    className: 'bg-violet-100 text-violet-700'
  },
  ACCIDENTE_TAXI: {
    label: 'Accidente Taxi',
    className: 'bg-slate-100 text-slate-700'
  },
  CMR: { label: 'CMR', className: 'bg-cyan-100 text-cyan-700' }
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
              const status = statusConfig[policy.status]
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
                        {policy.insurerName}
                        {policy.vehicleOrProperty &&
                          ` · ${policy.vehicleOrProperty}`}
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
                      {policy.status === 'ACTIVE' && (
                        <span
                          className={cn(
                            'text-[11px] hidden sm:block',
                            policy.daysUntilExpiry <= 30
                              ? 'font-medium text-amber-600'
                              : 'text-gray-400'
                          )}
                        >
                          {formatDaysUntilExpiry(policy.daysUntilExpiry, t)}
                        </span>
                      )}
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
