import type { ReactNode } from 'react'

const typeLabels: Record<string, string> = {
  RCA: 'RCA',
  CASCO: 'CASCO',
  CASCO_ECONOM: 'CASCO Econom',
  LOCUINTA_PAD: 'Locuință PAD',
  LOCUINTA_FACULTATIVA: 'Locuință Facultativă',
  CALATORIE: 'Călătorie',
  VIATA: 'Viață',
  ASISTENTA_RUTIERA: 'Asistență Rutieră',
  MALPRAXIS: 'Malpraxis',
  SANATATE: 'Sănătate',
  ACCIDENTE_CALATORI: 'Accidente Călători',
  ACCIDENTE_PERSOANE: 'Accidente Persoane',
  ACCIDENTE_TAXI: 'Accidente Taxi',
  CMR: 'CMR'
}

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
  const config = typeConfig[type] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600'
  }
  const label = typeLabels[type] || type

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      {label}
    </span>
  )
}

// Export type labels for use in other components
export { typeLabels }
