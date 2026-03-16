import logo from '@/assets/logo.svg'
import { RegisterForm } from '@/components/auth/register-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useRegister } from '@/hooks/use-register'
import type { RegisterFormValues } from '@/lib/validators'
import { useAuthStore } from '@/stores/auth-store'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

export default function RegisterPage() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [isSuccess, setIsSuccess] = useState(false)
  const registerMutation = useRegister()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

  const handleRegister = (data: RegisterFormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-xl space-y-6 rounded-lg bg-white p-6 sm:p-12">
        <div className="text-center">
          <img src={logo} alt="asigurari.ro" className="mx-auto mb-4 h-10" />
          <h1 className="text-xl font-bold text-gray-900">{t('auth.register.pageTitle')}</h1>
          <p className="mt-1 text-sm text-gray-400">
            {t('auth.register.pageSubtitle')}
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="text-center">
            {!isSuccess ? (
              <>
                <CardTitle className="text-gray-900">{t('auth.register.title')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.register.description')}
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-gray-900">
                  {t('auth.register.successTitle')}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.register.successDescription')}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {!isSuccess ? (
              <RegisterForm
                onSubmit={handleRegister}
                isLoading={registerMutation.isPending}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 className="h-16 w-16 text-accent-green animate-bounce" />
                <p className="text-sm text-gray-400 text-center">
                  {t('auth.register.successMessage')}
                </p>
                <Link
                  to="/login"
                  className="mt-2 text-sm font-medium text-accent-green hover:text-accent-green-hover transition-colors"
                >
                  {t('auth.backToLogin')}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {!isSuccess && (
          <p className="text-center text-sm text-gray-400">
            {t('auth.hasAccount')}{' '}
            <Link
              to="/login"
              className="font-medium text-accent-green hover:text-accent-green-hover transition-colors"
            >
              {t('auth.loginLink')}
            </Link>
          </p>
        )}

        <p className="text-center text-xs text-gray-400">
          {t('common.copyright')}
        </p>
      </div>
    </div>
  )
}
