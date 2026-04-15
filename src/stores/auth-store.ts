import type { UserProfile } from '@/api/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: UserProfile | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (user: UserProfile, accessToken: string, refreshToken: string) => void
  logout: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: UserProfile) => void
  setTwoFactorEnabled: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      setTwoFactorEnabled: (value) =>
        set((state) => ({
          user: state.user ? { ...state.user, twoFactorEnabled: value } : null
        }))
    }),
    {
      name: 'asigurari-auth',
      version: 2,
      migrate: (persisted, _version) => {
        const state = persisted as Partial<AuthState>
        if (state.user) {
          const u = state.user as unknown as Record<string, unknown>
          if (u.first_name && !u.firstName) {
            u.firstName = u.first_name
          }
          if (u.last_name && !u.lastName) {
            u.lastName = u.last_name
          }
          delete u.first_name
          delete u.last_name
        }
        return state as AuthState
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
