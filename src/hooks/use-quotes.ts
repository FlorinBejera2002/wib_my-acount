import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PaginatedResponse, Quote, TableParams } from '@/api/types'
import { useQuery } from '@tanstack/react-query'
import { useUserActivity } from './use-user-activity'

const fetchQuotes = async (
  params: TableParams
): Promise<PaginatedResponse<Quote>> => {
  const { data } = await api.get<PaginatedResponse<Quote>>(
    ENDPOINTS.QUOTES.LIST,
    { params }
  )
  return data
}

const fetchQuote = async (id: string): Promise<Quote> => {
  const { data } = await api.get<Quote>(ENDPOINTS.QUOTES.DETAIL(id))
  return data
}

const POLL_INTERVAL = 5 * 60 * 1000

export function useQuotes(params: TableParams) {
  const isUserActive = useUserActivity()

  return useQuery({
    queryKey: ['quotes', params],
    queryFn: () => fetchQuotes(params),
    refetchInterval: isUserActive ? POLL_INTERVAL : false,
    refetchIntervalInBackground: false,
  })
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ['quotes', id],
    queryFn: () => fetchQuote(id),
    enabled: !!id
  })
}
