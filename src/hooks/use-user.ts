import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  UpdatePreferencesRequest,
  UpdateProfileRequest,
  UserProfile
} from '@/api/types'
import { delay } from '@/lib/utils'
import { mockUser } from '@/mocks/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const fetchProfile = async (): Promise<UserProfile> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.USERS.PROFILE);
  // return data;

  await delay(500)
  return mockUser
}

const updateProfileFn = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  const { data: response } = await api.patch(
    ENDPOINTS.USERS.UPDATE_PROFILE,
    data
  )
  return response
}

const updatePreferencesFn = async (
  data: UpdatePreferencesRequest
): Promise<UserProfile> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.patch(ENDPOINTS.USERS.UPDATE_PREFERENCES, data);
  // return response;

  await delay(600)
  return { ...mockUser, preferences: { ...mockUser.preferences, ...data } }
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfileFn,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      toast.success('Profilul a fost actualizat cu succes')
    },
    onError: () => {
      toast.error('Eroare la actualizarea profilului')
    }
  })
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePreferencesFn,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      toast.success('Preferințele au fost salvate')
    },
    onError: () => {
      toast.error('Eroare la salvarea preferințelor')
    }
  })
}

const uploadProfilePhotoFn = async (file: File): Promise<UserProfile> => {
  // TODO: decomentează când API-ul e gata
  // const formData = new FormData();
  // formData.append("photo", file);
  // const { data } = await api.post(ENDPOINTS.USERS.UPLOAD_PHOTO, formData);
  // return data;

  await delay(800)
  const photoUrl = URL.createObjectURL(file)
  return { ...mockUser, photoUrl }
}

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadProfilePhotoFn,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      toast.success('Fotografia de profil a fost actualizată')
    },
    onError: () => {
      toast.error('Eroare la încărcarea fotografiei')
    }
  })
}
