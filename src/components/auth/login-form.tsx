import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type LoginFormValues, loginSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void
  isLoading: boolean
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const schema = useMemo(() => loginSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
          {t('auth.emailLabel')}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          autoComplete="email"
          autoFocus={true}
          className="h-11 border-slate-200 focus-visible:ring-blue-800/20 focus-visible:border-blue-800"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-slate-700 text-sm font-medium"
        >
          {t('auth.passwordLabel')}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.passwordPlaceholder')}
            autoComplete="current-password"
            className="h-11 pr-10 border-slate-200 focus-visible:ring-blue-800/20 focus-visible:border-blue-800"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <div className="flex justify-end pt-0.5">
          <Link
            to="/forgot-password"
            className="text-xs text-blue-800 hover:text-blue-900 font-medium transition-colors"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-blue-800 hover:bg-blue-900 text-white font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('auth.verifying')}
          </>
        ) : (
          t('auth.loginButton')
        )}
      </Button>
    </form>
  )
}
