import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useProfile, useUpdatePreferences } from '@/hooks/use-user'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function NotificationSettings() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useProfile()
  const updatePreferences = useUpdatePreferences()

  const enabled = profile?.preferences?.notifications ?? true

  const handleToggle = (value: boolean) => {
    updatePreferences.mutate({ notifications: value })
  }

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 1 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t('settings.notifications')}</CardTitle>
        <CardDescription>{t('settings.notificationsSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{t('settings.emailNotifications')}</p>
            <p className="text-sm text-muted-foreground">
              {t('settings.emailNotificationsDesc')}
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={updatePreferences.isPending}
          />
        </div>
        {updatePreferences.isPending && (
          <div className="flex justify-end mt-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
