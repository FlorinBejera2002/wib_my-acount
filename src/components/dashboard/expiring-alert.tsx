import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ExpiringPolicy {
  id: string
  policyNumber: string
  type: string
  endDate: string
}

interface ExpiringAlertProps {
  policies: ExpiringPolicy[]
}

export function ExpiringAlert({ policies }: ExpiringAlertProps) {
  const { t } = useTranslation()

  if (policies.length === 0) return null

  const label =
    policies.length === 1
      ? t('dashboard.expiringAlertSingle')
      : t('dashboard.expiringAlert', { count: policies.length })

  const names = policies
    .map((p) => {
      const daysLeft = Math.ceil(
        (new Date(p.endDate).getTime() - Date.now()) / 86400000
      )
      return `${t(`insuranceType.${p.type.toUpperCase()}`, { defaultValue: p.type })} (${t('dashboard.reminderDaysLeft', { days: daysLeft })})`
    })
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
