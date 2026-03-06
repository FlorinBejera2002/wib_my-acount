import type { DashboardStats } from '@/api/types'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { AlertTriangle, Bell, ClipboardList, FileText } from 'lucide-react'

interface StatsCardsProps {
  stats: DashboardStats | undefined
  isLoading: boolean
}

const cards = [
  {
    label: 'Total Cotații',
    key: 'totalQuotes' as const,
    icon: ClipboardList,
    iconColor: 'text-accent-green'
  },
  {
    label: 'Polițe Active',
    key: 'activePolicies' as const,
    icon: FileText,
    iconColor: 'text-blue-500'
  },
  {
    label: 'Expiră Curând',
    key: 'expiringSoon' as const,
    icon: AlertTriangle,
    iconColor: 'text-amber-500'
  },
  {
    label: 'Notificări',
    key: 'unreadNotifications' as const,
    icon: Bell,
    iconColor: 'text-red-500'
  }
]

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
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
            <p className="text-xs text-gray-400">{card.label}</p>
            {isLoading ? (
              <Skeleton className="mt-1 h-6 w-10" />
            ) : (
              <p className="mt-1 text-xl font-bold text-gray-900">
                {stats?.[card.key] ?? 0}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
