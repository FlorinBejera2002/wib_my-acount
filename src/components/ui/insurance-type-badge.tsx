import {
  Car,
  Home,
  type LucideIcon,
  Plane,
  Shield,
  ShieldCheck,
  Stethoscope,
  Truck,
  UserCheck,
  Users,
  Wrench
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const typeConfig: Record<
  string,
  { bg: string; text: string; icon: LucideIcon }
> = {
  ACCIDENTS: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: Users },
  ACCIDENTS_TAXI: { bg: 'bg-sky-50', text: 'text-sky-700', icon: Car },
  ACCIDENTS_TRAVELER: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    icon: UserCheck
  },
  BREAKDOWN: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: Wrench },
  CASCO: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: ShieldCheck },
  CASCO_ECONOM: { bg: 'bg-teal-50', text: 'text-teal-700', icon: ShieldCheck },
  CMR: { bg: 'bg-lime-50', text: 'text-lime-700', icon: Truck },
  FACULTATIVE: { bg: 'bg-orange-50', text: 'text-orange-700', icon: Home },
  HEALTH: { bg: 'bg-pink-50', text: 'text-pink-700', icon: Stethoscope },
  HOME: { bg: 'bg-orange-50', text: 'text-orange-700', icon: Home },
  PAD: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Home },
  PAD_FACULTATIVE: { bg: 'bg-orange-50', text: 'text-orange-700', icon: Home },
  RCA: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Car },
  RCP: { bg: 'bg-rose-50', text: 'text-rose-700', icon: Shield },
  TRAVEL: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Plane }
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
