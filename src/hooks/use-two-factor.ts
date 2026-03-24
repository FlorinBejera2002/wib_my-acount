import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { Confirm2FARequest, Enable2FAResponse } from '@/api/types'
import i18n from '@/lib/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const enable2FAFn = async (): Promise<Enable2FAResponse> => {
  const { data } = await api.post<Enable2FAResponse>(
    ENDPOINTS.AUTH.ENABLE_2FA
  )
  return data
}

const confirm2FAFn = async (data: Confirm2FARequest): Promise<void> => {
  await api.post(ENDPOINTS.AUTH.CONFIRM_2FA, data)
}

const disable2FAFn = async (): Promise<void> => {
  await api.post(ENDPOINTS.AUTH.DISABLE_2FA)
}

export function useEnable2FA() {
  return useMutation({
    mutationFn: enable2FAFn,
    onError: () => {
      toast.error(i18n.t('toast.twoFactorEnableError'))
    }
  })
}

export function useConfirm2FA() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: confirm2FAFn,
    onSuccess: () => {
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

  return useMutation({
    mutationFn: disable2FAFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success(i18n.t('toast.twoFactorDisabled'))
    },
    onError: () => {
      toast.error(i18n.t('toast.twoFactorDisableError'))
    }
  })
}
