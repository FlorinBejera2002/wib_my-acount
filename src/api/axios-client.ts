import { useAuthStore } from '@/stores/auth-store'
import axios from 'axios'
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios'
import { ENDPOINTS } from './endpoints'
import type { RefreshTokenResponse } from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
})

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response interceptor: handle 401 with token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token)
    } else {
      promise.reject(error)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Don't retry refresh endpoint itself
    if (originalRequest.url === ENDPOINTS.AUTH.REFRESH) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { refreshToken } = useAuthStore.getState()
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      const { data } = await api.post<RefreshTokenResponse>(
        ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      )

      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
      processQueue(null, data.accessToken)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      }
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export { api }
