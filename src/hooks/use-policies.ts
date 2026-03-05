import { useQuery } from "@tanstack/react-query";
import { mockPolicies } from "@/mocks/policies";
import { delay, paginateMock } from "@/lib/utils";
import type { Policy, PaginatedResponse, TableParams } from "@/api/types";

const fetchPolicies = async (
  params: TableParams
): Promise<PaginatedResponse<Policy>> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.POLICIES.LIST, { params });
  // return data;

  await delay(500);
  return paginateMock(mockPolicies, params);
};

const fetchPolicy = async (id: string): Promise<Policy> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.POLICIES.DETAIL(id));
  // return data;

  await delay(400);
  const policy = mockPolicies.find((p) => p.id === id);
  if (!policy) throw new Error("Polița nu a fost găsită");
  return policy;
};

export function usePolicies(params: TableParams) {
  return useQuery({
    queryKey: ["policies", params],
    queryFn: () => fetchPolicies(params),
  });
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: ["policies", id],
    queryFn: () => fetchPolicy(id),
    enabled: !!id,
  });
}
