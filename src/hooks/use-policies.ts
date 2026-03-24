import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PaginatedResponse, Policy, TableParams } from '@/api/types'
import { useQuery } from '@tanstack/react-query'

const fetchPolicies = async (
  params: TableParams
): Promise<PaginatedResponse<Policy>> => {
  const { data } = await api.get<PaginatedResponse<Policy>>(
    ENDPOINTS.POLICIES.LIST,
    { params }
  )
  return data
}

const fetchPolicy = async (id: string): Promise<Policy> => {
  const { data } = await api.get<Policy>(ENDPOINTS.POLICIES.DETAIL(id))
  return data
}

export function usePolicies(params: TableParams) {
  return useQuery({
    queryKey: ['policies', params],
    queryFn: () => fetchPolicies(params)
  })
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: ['policies', id],
    queryFn: () => fetchPolicy(id),
    enabled: !!id
  })
}
