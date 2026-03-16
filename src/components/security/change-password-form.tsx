import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChangePassword } from '@/hooks/use-password'
import {
  type ChangePasswordFormValues,
  changePasswordSchema
} from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PasswordStrength } from './password-strength'

export function ChangePasswordForm() {
  const { t } = useTranslation()
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const changePassword = useChangePassword()
  const schema = useMemo(() => changePasswordSchema(t), [t])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const newPassword = watch('newPassword')

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword.mutate(data, {
      onSuccess: () => reset()
    })
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t('security.changePassword')}</CardTitle>
        <CardDescription>
          {t('security.changePasswordSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">{t('security.currentPassword')}</Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOld ? 'text' : 'password'}
                className="pr-10"
                {...register('oldPassword')}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showOld ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-sm text-destructive">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('security.newPassword')}</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                className="pr-10"
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <PasswordStrength password={newPassword} />
            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('security.confirmNewPassword')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('security.changing')}
                </>
              ) : (
                t('security.changePasswordBtn')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
