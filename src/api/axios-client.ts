import { useAuthStore } from '@/stores/auth-store'
import axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { ENDPOINTS } from './endpoints'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 15000
})

const snakeToCamel = (key: string): string =>
  key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

const toCamelCase = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') return data
  if (Array.isArray(data)) return data.map(toCamelCase)
  const obj = data as Record<string, unknown>
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    result[snakeToCamel(key)] = toCamelCase(obj[key])
  }
  return result
}

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/)
  const token = match?.[1] ? decodeURIComponent(match[1]) : ''
  if (!token) {
    throw new Error('CSRF token missing — cannot send mutating request')
  }
  return token
}

api.interceptors.request.use(
  (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method ?? '')) {
      config.headers['X-CSRF-Token'] = getCsrfToken()
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: () => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown) => {
  for (const promise of failedQueue) {
    if (!error) {
      promise.resolve()
    } else {
      promise.reject(error)
    }
  }
  failedQueue = []
}

api.interceptors.response.use(
  (response) => {
    if (response.config.responseType === 'blob') return response
    response.data = toCamelCase(response.data)
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    const body = error.response?.data as Record<string, unknown> | undefined
    const errorObj = body?.error as Record<string, unknown> | undefined
    const backendMessage = (errorObj?.message ?? body?.message) as
      | string
      | undefined
    if (backendMessage) {
      error.message = backendMessage
    }

    const authOnlyEndpoints: string[] = [
      ENDPOINTS.AUTH.LOGIN,
      ENDPOINTS.AUTH.REGISTER,
      ENDPOINTS.AUTH.TWO_FACTOR,
      ENDPOINTS.AUTH.REFRESH,
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      ENDPOINTS.AUTH.RESET_PASSWORD,
      ENDPOINTS.AUTH.VERIFY_RESET_CODE,
      ENDPOINTS.AUTH.RESEND_2FA_CODE
    ]
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      authOnlyEndpoints.includes(originalRequest.url as string)
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => api(originalRequest))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await api.post(ENDPOINTS.AUTH.REFRESH)
      processQueue(null)
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export { api }
