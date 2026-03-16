import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  UpdatePreferencesRequest,
  UpdateProfileRequest,
  UserProfile
} from '@/api/types'
import i18n from '@/lib/i18n'
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
      toast.success(i18n.t('toast.profileUpdated'))
    },
    onError: () => {
      toast.error(i18n.t('toast.profileUpdateError'))
    }
  })
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePreferencesFn,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      if (data.preferences?.language) {
        i18n.changeLanguage(data.preferences.language)
      }
      toast.success(i18n.t('toast.preferencesSaved'))
    },
    onError: () => {
      toast.error(i18n.t('toast.preferencesError'))
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
      toast.success(i18n.t('toast.photoUpdated'))
    },
    onError: () => {
      toast.error(i18n.t('toast.photoError'))
    }
  })
}
