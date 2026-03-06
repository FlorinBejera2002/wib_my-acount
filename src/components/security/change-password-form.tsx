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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PasswordStrength } from './password-strength'

export function ChangePasswordForm() {
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const changePassword = useChangePassword()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
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
        <CardTitle>Schimbă parola</CardTitle>
        <CardDescription>
          Actualizează-ți parola pentru a menține contul securizat
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Parola actuală</Label>
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
            <Label htmlFor="newPassword">Parola nouă</Label>
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
            <Label htmlFor="confirmPassword">Confirmă parola nouă</Label>
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
                  Se schimbă...
                </>
              ) : (
                'Schimbă parola'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
