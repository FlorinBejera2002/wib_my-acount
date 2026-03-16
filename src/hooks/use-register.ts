import type { RegisterRequest, RegisterResponse } from '@/api/types'
import { delay } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const registerFn = async (data: RegisterRequest): Promise<RegisterResponse> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.post(ENDPOINTS.AUTH.REGISTER, data);
  // return response;

  await delay(1000)

  if (data.email === 'florinpetru0306@gmail.com') {
    throw new Error('Această adresă de email este deja înregistrată')
  }

  return {
    message: 'Contul a fost creat cu succes!',
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
