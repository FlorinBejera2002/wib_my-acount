import type { DashboardStats } from '@/api/types'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { AlertTriangle, Bell, ClipboardList, FileText } from 'lucide-react'
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
    case 'unreadNotifications':
      return stats.notifications.unread
    default:
      return 0
  }
}

const cards = [
  {
    labelKey: 'dashboard.totalQuotes',
    key: 'totalQuotes',
    icon: ClipboardList,
    iconColor: 'text-accent-green'
  },
  {
    labelKey: 'dashboard.activePolicies',
    key: 'activePolicies',
    icon: FileText,
    iconColor: 'text-blue-500'
  },
  {
    labelKey: 'dashboard.expiringSoon',
    key: 'expiringSoon',
    icon: AlertTriangle,
    iconColor: 'text-amber-500'
  },
  {
    labelKey: 'dashboard.notifications',
    key: 'unreadNotifications',
    icon: Bell,
    iconColor: 'text-red-500'
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
            className="relative rounded-xl bg-white p-4 shadow-sm border border-gray-100"
          >
            <Icon
              className={cn('absolute right-4 top-4 h-5 w-5', card.iconColor)}
            />
            <p className="text-xs text-gray-400">{t(card.labelKey)}</p>
            {isLoading ? (
              <Skeleton className="mt-1 h-6 w-10" />
            ) : (
              <p className="mt-1 text-xl font-bold text-gray-900">
                {getStatValue(stats, card.key)}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
