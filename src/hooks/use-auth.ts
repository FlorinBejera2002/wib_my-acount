import { api } from '@/api/axios-client'
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

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      if (!data.requires_two_factor && data.access_token && data.user) {
        login(data.user, data.access_token, data.refresh_token!)
        if (data.user.preferences?.language) {
          i18n.changeLanguage(data.user.preferences.language)
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('toast.emailOrPasswordIncorrect'))
    }
  })
}

export function useVerifyTwoFactor() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: verifyTwoFactorFn,
    onSuccess: (data) => {
      login(data.user, data.access_token, data.refresh_token)
      if (data.user.preferences?.language) {
        i18n.changeLanguage(data.user.preferences.language)
      }
      toast.success(i18n.t('toast.loginSuccess'))
      setTimeout(() => navigate('/dashboard'), 500)
    },
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('toast.codeInvalid'))
    }
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      logout()
      navigate('/login')
    }
  })
}
