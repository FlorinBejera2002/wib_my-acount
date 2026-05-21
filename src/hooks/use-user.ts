import { api } from '@/api/axios-client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  UpdatePreferencesRequest,
  UpdateProfileRequest,
  UserProfile
} from '@/api/types'
import i18n from '@/lib/i18n'
import { useAuthStore } from '@/stores/auth-store'
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
    onMutate: (variables) => {
      if (variables.language) {
        // Apply immediately in UI
        i18n.changeLanguage(variables.language)
        // Persist locally so it survives page reload even if API rejects it
        const store = useAuthStore.getState()
        if (store.user) {
          store.setUser({
            ...store.user,
            preferences: {
              ...(store.user as UserProfile).preferences,
              language: variables.language
            }
          } as UserProfile)
        }
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<UserProfile | undefined>(['profile'], (old) =>
        old ? { ...old, preferences: data.preferences } : old
      )
      toast.success(i18n.t('toast.preferencesSaved'))
    },
    onError: (_err, variables) => {
      // Language already changed locally — only show error if it wasn't a language-only failure
      if (!variables.language) {
        toast.error(i18n.t('toast.preferencesError'))
      }
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
