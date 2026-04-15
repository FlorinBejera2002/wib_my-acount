import { RecentPolicies } from '@/components/dashboard/recent-policies'
import { RecentQuotes } from '@/components/dashboard/recent-quotes'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'
import { useProfile } from '@/hooks/use-user'
import { useTranslation } from 'react-i18next'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: profile } = useProfile()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t('dashboard.welcome', { name: profile ? `, ${profile.firstName}` : '' })}
        </h1>
        <p className="text-sm text-gray-400">{t('dashboard.subtitle')}</p>
      </div>

      <StatsCards stats={stats} isLoading={statsLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentQuotes />
        <RecentPolicies />
      </div>

      {/* ActivityChart removed — API does not provide monthly quote stats */}
    </div>
  )
}
