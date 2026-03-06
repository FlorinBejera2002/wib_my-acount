import type {
  LoginRequest,
  LoginResponse,
  TwoFactorRequest,
  TwoFactorResponse
} from '@/api/types'
import { delay } from '@/lib/utils'
import { mockUser } from '@/mocks/user'
import { useAuthStore } from '@/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const loginFn = async (data: LoginRequest): Promise<LoginResponse> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.post(ENDPOINTS.AUTH.LOGIN, data);
  // return response;

  await delay(800)

  if (
    data.email === 'florinpetru0306@gmail.com' &&
    data.password === 'password'
  ) {
    return {
      requiresTwoFactor: true,
      tempToken: 'temp_token_mock_123'
    }
  }

  throw new Error('Adresa de email sau parola este incorectă')
}

const verifyTwoFactorFn = async (
  data: TwoFactorRequest
): Promise<TwoFactorResponse> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.post(ENDPOINTS.AUTH.TWO_FACTOR, data);
  // return response;

  await delay(600)

  if (data.code === '123456') {
    return {
      accessToken: 'mock_access_token_abc',
      refreshToken: 'mock_refresh_token_xyz',
      user: mockUser
    }
  }

  throw new Error('Codul introdus nu este valid')
}

const logoutFn = async (): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.post(ENDPOINTS.AUTH.LOGOUT);

  await delay(300)
}

export function useLogin() {
  return useMutation({
    mutationFn: loginFn,
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export function useVerifyTwoFactor() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: verifyTwoFactorFn,
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken)
      toast.success('Autentificare reușită!')
      setTimeout(() => navigate('/dashboard'), 500)
    },
    onError: (error: Error) => {
      toast.error(error.message)
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
