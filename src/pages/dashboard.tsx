import { ActivityChart } from '@/components/dashboard/activity-chart'
import { ExpiringAlert } from '@/components/dashboard/expiring-alert'
import { RecentPolicies } from '@/components/dashboard/recent-policies'
import { RecentQuotes } from '@/components/dashboard/recent-quotes'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'
import { usePolicies } from '@/hooks/use-policies'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from 'react-i18next'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const user = useAuthStore((s) => s.user)

  const { data: policiesData } = usePolicies({
    page: 1,
    limit: 100,
    sort: 'daysUntilExpiry',
    order: 'asc'
  })

  const _expiringPolicies =
    policiesData?.data.filter(
      (p) => p.daysUntilExpiry > 0 && p.daysUntilExpiry <= 30
    ) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t('dashboard.welcome', { name: user ? `, ${user.firstName}` : '' })}
        </h1>
        <p className="text-sm text-gray-400">{t('dashboard.subtitle')}</p>
      </div>

      <StatsCards stats={stats} isLoading={statsLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentQuotes />
        <RecentPolicies />
      </div>

      <ActivityChart data={stats?.quotesPerMonth} isLoading={statsLoading} />
    </div>
  )
}
