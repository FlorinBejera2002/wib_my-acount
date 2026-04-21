import type { PolicyStatus } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const statusConfig: Record<
  PolicyStatus,
  { labelKey: string; className: string }
> = {
  active: {
    labelKey: 'policyStatus.ACTIVE',
    className: 'bg-green-100 text-green-800 hover:bg-green-100'
  },
  expired: {
    labelKey: 'policyStatus.EXPIRED',
    className: 'bg-red-100 text-red-800 hover:bg-red-100'
  },
  cancelled: {
    labelKey: 'policyStatus.CANCELLED',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  },
  pending: {
    labelKey: 'policyStatus.PENDING',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
  }
}

interface PolicyStatusBadgeProps {
  status: PolicyStatus
}

export function PolicyStatusBadge({ status }: PolicyStatusBadgeProps) {
  const { t } = useTranslation()
  const config = statusConfig[status] ?? statusConfig.active
  return (
    <Badge
      variant="outline"
      className={cn('border-0 font-medium', config.className)}
    >
      {t(config.labelKey)}
    </Badge>
  )
}
