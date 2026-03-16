import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema
} from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormValues) => void
  isLoading: boolean
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading
}: ForgotPasswordFormProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => forgotPasswordSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-900">
          {t('auth.emailLabel')}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          autoComplete="email"
          autoFocus={true}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-accent-green hover:bg-accent-green-hover text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('auth.sending')}
          </>
        ) : (
          t('auth.sendResetCode')
        )}
      </Button>
    </form>
  )
}
