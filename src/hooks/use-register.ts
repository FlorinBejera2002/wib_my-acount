import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { RegisterResponse } from '@/api/types'
import i18n from '@/lib/i18n'
import type { RegisterFormValues } from '@/lib/validators'
import { useAuthStore } from '@/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const registerFn = async (data: RegisterFormValues): Promise<RegisterResponse> => {
  const { data: response } = await api.post<RegisterResponse>(
    ENDPOINTS.AUTH.REGISTER,
    {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone
    }
  )
  return response
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation<RegisterResponse, AxiosError<{ error?: { code?: string } }>, RegisterFormValues>({
    mutationFn: registerFn,
    onSuccess: (response) => {
      login(response.user, response.accessToken, response.refreshToken)
      toast.success(i18n.t('toast.accountCreated'))
      setTimeout(() => navigate('/dashboard'), 500)
    },
    onError: (error) => {
      const code = error.response?.data?.error?.code
      if (code === 'USER_ALREADY_EXISTS') {
        toast.error(i18n.t('toast.emailAlreadyRegistered'))
      } else {
        toast.error(i18n.t('toast.registerError'))
      }
    }
  })
}
