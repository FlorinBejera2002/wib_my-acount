import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { DashboardStats } from '@/api/types'
import { useQuery } from '@tanstack/react-query'

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS)
  return data
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats
  })
}
