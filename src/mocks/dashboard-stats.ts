import type { DashboardStats } from '@/api/types'

export const mockDashboardStats: DashboardStats = {
  totalQuotes: 18,
  activePolicies: 4,
  expiringSoon: 2,
  unreadNotifications: 3,
  quotesPerMonth: [
    { month: '2025-06', count: 2 },
    { month: '2025-07', count: 4 },
    { month: '2025-08', count: 1 },
    { month: '2025-09', count: 5 },
    { month: '2025-10', count: 3 },
    { month: '2025-11', count: 3 }
  ]
}
