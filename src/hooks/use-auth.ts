import { api, clearCsrfToken, setCsrfToken } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  LoginRequest,
  LoginResponse,
  TwoFactorRequest,
  TwoFactorResponse
} from '@/api/types'
import i18n from '@/lib/i18n'
import { useAuthStore } from '@/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const loginFn = async (data: LoginRequest): Promise<LoginResponse> => {
  const { data: response } = await api.post<LoginResponse>(
    ENDPOINTS.AUTH.LOGIN,
    data
  )
  return response
}

const verifyTwoFactorFn = async (
  data: TwoFactorRequest
): Promise<TwoFactorResponse> => {
  const { data: response } = await api.post<TwoFactorResponse>(
    ENDPOINTS.AUTH.TWO_FACTOR,
    data
  )
  return response
}

const logoutFn = async (): Promise<void> => {
  await api.post(ENDPOINTS.AUTH.LOGOUT)
}

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      if (data.csrfToken) setCsrfToken(data.csrfToken)
      if (!data.requires_2fa && data.user) {
        login(data.user)
        toast.success(i18n.t('toast.loginSuccess'))
        setTimeout(() => navigate('/dashboard'), 500)
      }
    },
    onError: () => {
      toast.error(i18n.t('toast.emailOrPasswordIncorrect'))
    }
  })
}

export function useVerifyTwoFactor() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: verifyTwoFactorFn,
    onSuccess: (data) => {
      if (data.csrfToken) setCsrfToken(data.csrfToken)
      login(data.user)
      toast.success(i18n.t('toast.loginSuccess'))
      setTimeout(() => navigate('/dashboard'), 500)
    },
    onError: (error: AxiosError<{ error?: { code?: string } }>) => {
      const code = error.response?.data.error?.code
      const message =
        code === 'INVALID_TWO_FACTOR_CODE'
          ? i18n.t('toast.codeInvalid')
          : error.message || i18n.t('toast.codeInvalid')

      toast.error(message)
    }
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      clearCsrfToken()
      logout()
      navigate('/login')
    }
  })
}
