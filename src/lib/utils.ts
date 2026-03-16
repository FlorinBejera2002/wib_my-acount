import type { PaginatedResponse, TableParams } from '@/api/types'
import { type ClassValue, clsx } from 'clsx'
import { format, parseISO } from 'date-fns'
import { enUS, hu, ro } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'
import i18n from './i18n'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getDateLocale() {
  if (i18n.language === 'ro') return ro
  if (i18n.language === 'hu') return hu
  return enUS
}

export function formatCurrency(amount: number, currency = 'RON'): string {
  const localeMap: Record<string, string> = { ro: 'ro-RO', hu: 'hu-HU', en: 'en-US' }
  const locale = localeMap[i18n.language] || 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatDate(dateStr: string, pattern = 'dd MMM yyyy'): string {
  return format(parseISO(dateStr), pattern, { locale: getDateLocale() })
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm', { locale: getDateLocale() })
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function paginateMock<T>(
  items: T[],
  params: TableParams
): PaginatedResponse<T> {
  let filtered = [...items]

  // Apply search
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filtered = filtered.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchLower)
    )
  }

  // Apply filters
  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value) {
        filtered = filtered.filter((item) => {
          const itemValue = (item as Record<string, unknown>)[key]
          return String(itemValue) === value
        })
      }
    }
  }

  // Apply sort
  if (params.sort) {
    const sortKey = params.sort
    const order = params.order === 'desc' ? -1 : 1
    filtered.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey]
      const bVal = (b as Record<string, unknown>)[sortKey]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * order
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * order
      }
      return 0
    })
  }

  // Apply pagination
  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / params.limit)
  const start = (params.page - 1) * params.limit
  const end = start + params.limit
  const data = filtered.slice(start, end)

  return {
    data,
    meta: {
      currentPage: params.page,
      totalPages,
      totalItems,
      itemsPerPage: params.limit
    }
  }
}
