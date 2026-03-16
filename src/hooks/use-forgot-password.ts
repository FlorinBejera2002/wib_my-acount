import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse
} from '@/api/types'
import { delay } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const forgotPasswordFn = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  // return response;

  await delay(800)

  return {
    message: 'Codul de verificare a fost trimis pe email',
    tempToken: `reset_temp_token_${data.email}`
  }
}

const verifyResetCodeFn = async (
  data: VerifyResetCodeRequest
): Promise<VerifyResetCodeResponse> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.post(ENDPOINTS.AUTH.VERIFY_RESET_CODE, data);
  // return response;

  await delay(600)

  if (data.code === '123456') {
    return {
      resetToken: 'mock_reset_token_abc123'
    }
  }

  throw new Error('Codul introdus nu este valid')
}

const resetPasswordFn = async (
  _data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
  // return response;

  await delay(800)

  return {
    message: 'Parola a fost resetată cu succes!'
  }
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordFn,
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: verifyResetCodeFn,
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordFn,
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}
