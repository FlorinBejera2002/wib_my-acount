import { useTranslation } from 'react-i18next'

const typeConfig: Record<string, { bg: string; text: string }> = {
  RCA: { bg: 'bg-blue-100', text: 'text-blue-800' },
  CASCO: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  CASCO_ECONOM: { bg: 'bg-teal-100', text: 'text-teal-800' },
  LOCUINTA_PAD: { bg: 'bg-orange-100', text: 'text-orange-800' },
  LOCUINTA_FACULTATIVA: { bg: 'bg-amber-100', text: 'text-amber-800' },
  CALATORIE: { bg: 'bg-purple-100', text: 'text-purple-800' },
  VIATA: { bg: 'bg-rose-100', text: 'text-rose-800' },
  ASISTENTA_RUTIERA: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  MALPRAXIS: { bg: 'bg-red-100', text: 'text-red-800' },
  SANATATE: { bg: 'bg-pink-100', text: 'text-pink-800' },
  ACCIDENTE_CALATORI: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  ACCIDENTE_PERSOANE: { bg: 'bg-violet-100', text: 'text-violet-800' },
  ACCIDENTE_TAXI: { bg: 'bg-sky-100', text: 'text-sky-800' },
  CMR: { bg: 'bg-lime-100', text: 'text-lime-800' }
}

interface InsuranceTypeBadgeProps {
  type: string
  className?: string
}

export function InsuranceTypeBadge({
  type,
  className = ''
}: InsuranceTypeBadgeProps) {
  const { t } = useTranslation()
  const normalizedType = type.toUpperCase()
  const config = typeConfig[normalizedType] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600'
  }
  const label = t(`insuranceType.${normalizedType}`, { defaultValue: type })

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium text-nowrap ${config.bg} ${config.text} ${className}`}
    >
      {label}
    </span>
  )
}
