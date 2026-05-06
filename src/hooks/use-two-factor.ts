import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  Confirm2FARequest,
  Disable2FARequest,
  Enable2FARequest,
  Enable2FAResponse,
  TwoFactorMessageResponse
} from '@/api/types'
import i18n from '@/lib/i18n'
import { useAuthStore } from '@/stores/auth-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const enable2FAFn = async (
  data: Enable2FARequest
): Promise<Enable2FAResponse> => {
  const { data: response } = await api.post<Enable2FAResponse>(
    ENDPOINTS.AUTH.ENABLE_2FA,
    data
  )
  return response
}

const resend2FACodeFn = async (data: {
  pre_auth_token: string
}): Promise<TwoFactorMessageResponse> => {
  const { data: response } = await api.post<TwoFactorMessageResponse>(
    ENDPOINTS.AUTH.RESEND_2FA_CODE,
    data
  )
  return response
}

const confirm2FAFn = async (
  data: Confirm2FARequest
): Promise<TwoFactorMessageResponse> => {
  const { data: response } = await api.post<TwoFactorMessageResponse>(
    ENDPOINTS.AUTH.CONFIRM_2FA,
    data
  )
  return response
}

const disable2FAFn = async (
  data: Disable2FARequest
): Promise<TwoFactorMessageResponse> => {
  const { data: response } = await api.post<TwoFactorMessageResponse>(
    ENDPOINTS.AUTH.DISABLE_2FA,
    data
  )
  return response
}

export function useEnable2FA() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: enable2FAFn,
    onSuccess: (_, variables) => {
      if (variables.method === 'email') {
        queryClient.invalidateQueries({ queryKey: ['profile'] })
        toast.success(i18n.t('toast.twoFactorEnabled'))
      }
    },
    onError: () => {
      toast.error(i18n.t('toast.twoFactorEnableError'))
    }
  })
}

export function useResend2FACode() {
  return useMutation({
    mutationFn: resend2FACodeFn,
    onSuccess: () => {
      toast.success(i18n.t('toast.resendCodeSuccess'))
    },
    onError: () => {
      toast.error(i18n.t('toast.resendCodeError'))
    }
  })
}

export function useConfirm2FA() {
  const queryClient = useQueryClient()
  const setTwoFactorEnabled = useAuthStore((s) => s.setTwoFactorEnabled)

  return useMutation({
    mutationFn: confirm2FAFn,
    onSuccess: () => {
      setTwoFactorEnabled(true)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success(i18n.t('toast.twoFactorEnabled'))
    },
    onError: () => {
      toast.error(i18n.t('toast.codeInvalid'))
    }
  })
}

export function useDisable2FA() {
  const queryClient = useQueryClient()
  const setTwoFactorEnabled = useAuthStore((s) => s.setTwoFactorEnabled)

  return useMutation({
    mutationFn: disable2FAFn,
    onSuccess: () => {
      setTwoFactorEnabled(false)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success(i18n.t('toast.twoFactorDisabled'))
    },
    onError: () => {
      toast.error(i18n.t('toast.twoFactorDisableError'))
    }
  })
}
