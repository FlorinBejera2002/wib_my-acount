import {
  Car,
  Heart,
  Home,
  Plane,
  ShieldCheck,
  Stethoscope,
  Truck,
  UserCheck,
  Users,
  type LucideIcon
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const typeConfig: Record<
  string,
  { bg: string; text: string; icon: LucideIcon }
> = {
  RCA: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Car },
  CASCO: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: ShieldCheck },
  CASCO_ECONOM: { bg: 'bg-teal-50', text: 'text-teal-700', icon: ShieldCheck },
  LOCUINTA_PAD: { bg: 'bg-orange-50', text: 'text-orange-700', icon: Home },
  LOCUINTA_FACULTATIVA: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: Home
  },
  CALATORIE: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Plane },
  VIATA: { bg: 'bg-rose-50', text: 'text-rose-700', icon: Heart },
  ASISTENTA_RUTIERA: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: Car },
  MALPRAXIS: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: Stethoscope
  },
  SANATATE: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    icon: Stethoscope
  },
  ACCIDENTE_CALATORI: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    icon: Users
  },
  ACCIDENTE_PERSOANE: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    icon: UserCheck
  },
  ACCIDENTE_TAXI: { bg: 'bg-sky-50', text: 'text-sky-700', icon: Car },
  CMR: { bg: 'bg-lime-50', text: 'text-lime-700', icon: Truck },
  TRAVEL: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Plane },
  HEALTH: { bg: 'bg-pink-50', text: 'text-pink-700', icon: Stethoscope },
  PAD: { bg: 'bg-orange-50', text: 'text-orange-700', icon: Home },
  FACULTATIVE: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Home },
  PAD_FACULTATIVE: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Home }
}

const defaultConfig = {
  bg: 'bg-gray-50',
  text: 'text-gray-600',
  icon: ShieldCheck
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
  const config = typeConfig[normalizedType] || defaultConfig
  const Icon = config.icon
  const label = t(`insuranceType.${normalizedType}`, { defaultValue: type })

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold text-nowrap ${config.bg} ${config.text} border-current/15 ${className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  )
}
