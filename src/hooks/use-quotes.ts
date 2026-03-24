import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PaginatedResponse, Quote, TableParams } from '@/api/types'
import { useQuery } from '@tanstack/react-query'

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

export function useQuotes(params: TableParams) {
  return useQuery({
    queryKey: ['quotes', params],
    queryFn: () => fetchQuotes(params)
  })
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ['quotes', id],
    queryFn: () => fetchQuote(id),
    enabled: !!id
  })
}
