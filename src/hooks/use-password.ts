import type { ChangePasswordRequest } from '@/api/types'
import i18n from '@/lib/i18n'
import { delay } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const changePasswordFn = async (data: ChangePasswordRequest): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.post(ENDPOINTS.USERS.CHANGE_PASSWORD, data);

  await delay(700)

  if (data.oldPassword === 'wrong') {
    throw new Error(i18n.t('toast.currentPasswordIncorrect'))
  }
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
