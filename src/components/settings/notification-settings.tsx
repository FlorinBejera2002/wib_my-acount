import type { NotificationPreferences } from '@/api/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useProfile, useUpdatePreferences } from '@/hooks/use-user'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function NotificationSettings() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useProfile()
  const updatePreferences = useUpdatePreferences()

  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<NotificationPreferences>({
    values: profile?.preferences.notifications
  })

  const onSubmit = (data: NotificationPreferences) => {
    if (!profile) return
    updatePreferences.mutate({
      language: profile.preferences.language,
      timezone: profile.preferences.timezone,
      notifications: data
    })
  }

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
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
        <CardTitle>{t('settings.notifications')}</CardTitle>
        <CardDescription>{t('settings.notificationsSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.newQuotes')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.newQuotesDesc')}
                </p>
              </div>
              <Controller
                control={control}
                name="quotes"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.policyExpiry')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.policyExpiryDesc')}
                </p>
              </div>
              <Controller
                control={control}
                name="policiesExpiry"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || updatePreferences.isPending}
            >
              {updatePreferences.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('settings.saving')}
                </>
              ) : (
                t('settings.saveSettings')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
