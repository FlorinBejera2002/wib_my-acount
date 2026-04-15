import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ChangePasswordRequest } from '@/api/types'
import i18n from '@/lib/i18n'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

const changePasswordFn = async (data: ChangePasswordRequest): Promise<void> => {
  await api.post(ENDPOINTS.USERS.CHANGE_PASSWORD, data)
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordFn,
    onSuccess: () => {
      toast.success(i18n.t('toast.passwordChanged'))
    },
    onError: (error: AxiosError<{ error?: { code?: string } }>) => {
      const code = error.response?.data?.error?.code
      if (code === 'SAME_PASSWORD') {
        toast.error(i18n.t('toast.samePassword'))
      } else if (code === 'INVALID_CURRENT_PASSWORD') {
        toast.error(i18n.t('toast.currentPasswordIncorrect'))
      } else {
        toast.error(error.message || i18n.t('toast.passwordChangeError'))
      }
    }
  })
}
