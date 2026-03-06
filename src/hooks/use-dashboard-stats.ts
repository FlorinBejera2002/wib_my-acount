import type { DashboardStats } from '@/api/types'
import { delay } from '@/lib/utils'
import { mockDashboardStats } from '@/mocks/dashboard-stats'
import { useQuery } from '@tanstack/react-query'

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.DASHBOARD.STATS);
  // return data;

  await delay(500)
  return mockDashboardStats
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats
  })
}
