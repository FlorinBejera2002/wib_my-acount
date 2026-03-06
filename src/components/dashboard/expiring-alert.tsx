import type { Policy } from '@/api/types'
import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ExpiringAlertProps {
  policies: Policy[]
}

export function ExpiringAlert({ policies }: ExpiringAlertProps) {
  if (policies.length === 0) return null

  const label =
    policies.length === 1
      ? '1 poliță expiră în curând'
      : `${policies.length} polițe expiră în curând`

  const names = policies
    .map((p) => `${p.type} – ${p.insurerName} (${p.daysUntilExpiry} zile)`)
    .join(', ')

  return (
    <Link
      to="/policies"
      className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm transition-colors hover:bg-amber-50"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
      <span className="font-medium text-amber-800">{label}</span>
      <span className="hidden truncate text-xs text-amber-600 sm:block">
        — {names}
      </span>
    </Link>
  )
}
