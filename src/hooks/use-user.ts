import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  UpdatePreferencesRequest,
  UpdateProfileRequest,
  UserProfile
} from '@/api/types'
import i18n from '@/lib/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const fetchProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>(ENDPOINTS.USERS.PROFILE)
  return data
}

const updateProfileFn = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  const { data: response } = await api.patch<UserProfile>(
    ENDPOINTS.USERS.UPDATE_PROFILE,
    data
  )
  return response
}

const updatePreferencesFn = async (
  data: UpdatePreferencesRequest
): Promise<{ preferences: UserProfile['preferences'] }> => {
  const { data: response } = await api.patch<{
    preferences: UserProfile['preferences']
  }>(ENDPOINTS.USERS.UPDATE_PREFERENCES, data)
  return response
}

const deleteAccountFn = async (): Promise<void> => {
  await api.post(ENDPOINTS.USERS.DELETE_ACCOUNT)
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
      queryClient.setQueryData<UserProfile | undefined>(
        ['profile'],
        (old) => (old ? { ...old, preferences: data.preferences } : old)
      )
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

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccountFn,
    onError: () => {
      toast.error(i18n.t('toast.deleteAccountError'))
    }
  })
}
