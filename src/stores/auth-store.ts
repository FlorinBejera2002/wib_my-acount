import type { LoginUser, UserProfile } from '@/api/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type StoreUser = LoginUser | UserProfile

interface AuthState {
  user: StoreUser | null
  isAuthenticated: boolean
  login: (user: StoreUser) => void
  logout: () => void
  setUser: (user: StoreUser) => void
  setTwoFactorEnabled: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) =>
        set({
          user,
          isAuthenticated: true
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false
        }),

      setUser: (user) => set({ user }),

      setTwoFactorEnabled: (value) =>
        set((state) => ({
          user: state.user ? { ...state.user, twoFactorEnabled: value } : null
        }))
    }),
    {
      name: 'asigurari-auth',
      version: 3,
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
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
