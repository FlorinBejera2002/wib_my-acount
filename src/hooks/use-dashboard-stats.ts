import { useQuery } from "@tanstack/react-query";
import { mockDashboardStats } from "@/mocks/dashboard-stats";
import { delay } from "@/lib/utils";
import type { DashboardStats } from "@/api/types";

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.DASHBOARD.STATS);
  // return data;

  await delay(500);
  return mockDashboardStats;
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });
}
