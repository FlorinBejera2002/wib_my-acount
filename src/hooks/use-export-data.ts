import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ExportDataResponse } from '@/api/types'
import { useQuery } from '@tanstack/react-query'

const fetchExportData = async (): Promise<ExportDataResponse> => {
  const { data } = await api.get<ExportDataResponse>(
    ENDPOINTS.USERS.EXPORT_DATA
  )
  return data
}

export function useExportData() {
  return useQuery({
    queryKey: ['export-data'],
    queryFn: fetchExportData,
    enabled: false
  })
}
