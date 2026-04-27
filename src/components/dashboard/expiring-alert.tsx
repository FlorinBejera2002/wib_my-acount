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
      to={
        policies.length === 1 && policies[0]
          ? `/policies?policyId=${policies[0].id}`
          : '/policies'
      }
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/30 px-4 py-3 text-sm transition-all hover:bg-slate-50/50 hover:border-slate-300"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
      <span className="font-medium text-slate-700">{label}</span>
      <span className="hidden truncate text-xs text-slate-500 sm:block">
        — {names}
      </span>
    </Link>
  )
}
