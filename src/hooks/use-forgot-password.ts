import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse
} from '@/api/types'
import i18n from '@/lib/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const forgotPasswordFn = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const { data: response } = await api.post<ForgotPasswordResponse>(
    ENDPOINTS.AUTH.FORGOT_PASSWORD,
    data
  )
  return response
}

const verifyResetCodeFn = async (
  data: VerifyResetCodeRequest
): Promise<VerifyResetCodeResponse> => {
  const { data: response } = await api.post<VerifyResetCodeResponse>(
    ENDPOINTS.AUTH.VERIFY_RESET_CODE,
    data
  )
  return response
}

const resetPasswordFn = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const { data: response } = await api.post<ResetPasswordResponse>(
    ENDPOINTS.AUTH.RESET_PASSWORD,
    data
  )
  return response
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
      toast.error(error.message || i18n.t('toast.codeInvalid'))
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
