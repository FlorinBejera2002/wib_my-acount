import type { DashboardStats } from '@/api/types'

export const mockDashboardStats: DashboardStats = {
  policies: {
    total: 5,
    active: 4,
    byType: { rca: 2, casco: 1, home: 2 },
    expiringSoon: [
      { id: 'pol_001', policyNumber: 'POL-2026-001', type: 'rca', endDate: '2026-05-15' },
      { id: 'pol_003', policyNumber: 'POL-2026-003', type: 'home', endDate: '2026-05-20' }
    ]
  },
  quotes: {
    total: 18,
    pending: 3
  },
  notifications: {
    unread: 3,
    total: 12
  },
  reminders: {
    upcoming: [
      { id: 'rem_001', title: 'Renew RCA policy', remindAt: '2026-04-25T09:00:00Z' }
    ],
    total: 4
  },
  monthlyActivity: [
    { month: '2025-11', quotes: 5, policies: 2 },
    { month: '2025-12', quotes: 8, policies: 3 },
    { month: '2026-01', quotes: 12, policies: 5 },
    { month: '2026-02', quotes: 7, policies: 4 },
    { month: '2026-03', quotes: 15, policies: 6 },
    { month: '2026-04', quotes: 10, policies: 3 }
  ]
}
