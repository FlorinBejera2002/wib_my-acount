import { useProfile } from '@/hooks/use-user'
import { useAuthStore } from '@/stores/auth-store'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const setUser = useAuthStore((s) => s.setUser)
  const {
    data: profile,
    isError,
    isLoading
  } = useProfile({
    enabled: isAuthenticated
  })

  useEffect(() => {
    if (profile) {
      setUser(profile)
    }
  }, [profile, setUser])

  useEffect(() => {
    if (isError) {
      logout()
    }
  }, [isError, logout])

  if (!isAuthenticated || isError) {
    return <Navigate to="/login" replace={true} />
  }

  if (isLoading) {
    return null
  }

  return <Outlet />
}
