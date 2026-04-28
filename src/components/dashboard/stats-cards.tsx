import type { DashboardStats } from '@/api/types'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { AlertTriangle, ClipboardList, Clock, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StatsCardsProps {
  stats: DashboardStats | undefined
  isLoading: boolean
}

function getStatValue(
  stats: DashboardStats | undefined,
  key: string
): number {
  if (!stats) return 0
  switch (key) {
    case 'totalQuotes':
      return stats.quotes.total
    case 'activePolicies':
      return stats.policies.active
    case 'expiringSoon':
      return stats.policies.expiringSoon.length
    case 'totalReminders':
      return stats.reminders.total
    default:
      return 0
  }
}

const cards = [
  {
    labelKey: 'dashboard.totalQuotes',
    key: 'totalQuotes',
    icon: ClipboardList,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50'
  },
  {
    labelKey: 'dashboard.activePolicies',
    key: 'activePolicies',
    icon: FileText,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50'
  },
  {
    labelKey: 'dashboard.expiringSoon',
    key: 'expiringSoon',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50'
  },
  {
    labelKey: 'dashboard.upcomingReminders',
    key: 'totalReminders',
    icon: Clock,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50'
  }
]

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.key}
            className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t(card.labelKey)}
                </p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-8 w-16" />
                ) : (
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {getStatValue(stats, card.key)}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl',
                  card.iconBg
                )}
              >
                <Icon className={cn('h-5 w-5', card.iconColor)} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
