import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ChangePasswordRequest } from '@/api/types'
import i18n from '@/lib/i18n'
import { useMutation } from '@tanstack/react-query'
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
    onError: (error: Error) => {
      toast.error(error.message || i18n.t('toast.passwordChangeError'))
    }
  })
}
