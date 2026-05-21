import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PaginatedResponse, Policy, TableParams } from '@/api/types'
import { useMutation, useQuery } from '@tanstack/react-query'

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

export function useDownloadPolicyDocument() {
  return useMutation({
    mutationFn: async ({
      transactionId,
      fileId
    }: {
      transactionId: string
      fileId: string
    }) => {
      const { data } = await api.get<{ downloadUrl: string }>(
        ENDPOINTS.POLICIES.DOWNLOAD_DOCUMENT(transactionId, fileId)
      )
      window.open(data.downloadUrl, '_blank', 'noopener,noreferrer')
    }
  })
}
