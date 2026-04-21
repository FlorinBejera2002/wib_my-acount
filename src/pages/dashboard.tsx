import { ExpiringAlert } from '@/components/dashboard/expiring-alert'
import { MonthlyActivityChart } from '@/components/dashboard/monthly-activity-chart'
import { RecentPolicies } from '@/components/dashboard/recent-policies'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { UpcomingReminders } from '@/components/dashboard/upcoming-reminders'
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

      {stats && stats.policies.expiringSoon.length > 0 && (
        <ExpiringAlert policies={stats.policies.expiringSoon} />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyActivityChart />
        <RecentPolicies />
      </div>

      {stats && stats.reminders.upcoming.length > 0 && (
        <UpcomingReminders reminders={stats.reminders.upcoming} />
      )}
    </div>
  )
}
