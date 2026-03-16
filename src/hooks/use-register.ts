import type { RegisterRequest, RegisterResponse } from '@/api/types'
import i18n from '@/lib/i18n'
import { delay } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const registerFn = async (data: RegisterRequest): Promise<RegisterResponse> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.post(ENDPOINTS.AUTH.REGISTER, data);
  // return response;

  await delay(1000)

  if (data.email === 'florinpetru0306@gmail.com') {
    throw new Error(i18n.t('toast.emailAlreadyRegistered'))
  }

  return {
    message: i18n.t('toast.accountCreated'),
    requiresVerification: true
  }
}

export function useRegister() {
  return useMutation({
    mutationFn: registerFn,
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}
