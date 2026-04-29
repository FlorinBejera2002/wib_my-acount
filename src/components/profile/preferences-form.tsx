import type { UpdatePreferencesRequest } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CardSectionHeader } from '@/components/ui/card-icon-header'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile, useUpdatePreferences } from '@/hooks/use-user'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function PreferencesForm() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useProfile()
  const updatePreferences = useUpdatePreferences()

  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<UpdatePreferencesRequest>({
    values: {
      language: profile?.preferences?.language ?? 'ro'
    }
  })

  const onSubmit = (data: UpdatePreferencesRequest) => {
    updatePreferences.mutate(data)
  }

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardSectionHeader title="" />
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardSectionHeader
        title={t('preferences.title')}
        description={t('preferences.subtitle')}
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('preferences.language')}</Label>
              <Controller
                control={control}
                name="language"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ro">
                        {t('preferences.romanian')}
                      </SelectItem>
                      <SelectItem value="en">
                        {t('preferences.english')}
                      </SelectItem>
                      <SelectItem value="hu">
                        {t('preferences.hungarian')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  {t('preferences.saving')}
                </>
              ) : (
                t('preferences.savePreferences')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
