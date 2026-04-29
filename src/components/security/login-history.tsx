import { Card, CardContent } from '@/components/ui/card'
import { CardSectionHeader } from '@/components/ui/card-icon-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/hooks/use-user'
import { formatDateTime } from '@/lib/utils'
import { Shield, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function LoginHistory() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardSectionHeader title="" />
        <CardContent className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
            >
              <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardSectionHeader
        title={t('security.securityInfo')}
        description={t('security.securityInfoSubtitle')}
      />
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {t('security.accountCreated')}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile?.createdAt ? formatDateTime(profile.createdAt) : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {t('security.twoFactorStatus')}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile?.twoFactorEnabled
                ? t('security.twoFactorEnabled')
                : t('security.twoFactorDisabled')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
