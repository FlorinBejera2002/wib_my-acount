import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { RegisterRequest, RegisterResponse } from '@/api/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const registerFn = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const { data: response } = await api.post<RegisterResponse>(
    ENDPOINTS.AUTH.REGISTER,
    data
  )
  return response
}

export function useRegister() {
  return useMutation({
    mutationFn: registerFn,
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}
