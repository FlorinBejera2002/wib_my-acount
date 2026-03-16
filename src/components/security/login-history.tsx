import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/hooks/use-user'
import { formatDateTime } from '@/lib/utils'
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function LoginHistory() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t('security.securityInfo')}</CardTitle>
        <CardDescription>
          {t('security.securityInfoSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border p-4">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium">{t('security.lastLogin')}</p>
            <p className="text-sm text-muted-foreground">
              {profile?.security.lastLogin
                ? formatDateTime(profile.security.lastLogin)
                : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium">{t('security.passwordChanged')}</p>
            <p className="text-sm text-muted-foreground">
              {profile?.security.passwordChangedAt
                ? formatDateTime(profile.security.passwordChangedAt)
                : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-sm font-medium">
              {t('security.failedAttempts')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('security.attemptsCount', { count: profile?.security.failedAttempts ?? 0 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
