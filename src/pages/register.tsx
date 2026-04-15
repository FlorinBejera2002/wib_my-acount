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
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

export default function RegisterPage() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const registerMutation = useRegister()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-xl space-y-6 rounded-lg bg-white p-6 sm:p-12">
        <div className="text-center">
          <img src={logo} alt="asigurari.ro" className="mx-auto mb-4 h-10" />
          <h1 className="text-xl font-bold text-gray-900">
            {t('auth.register.pageTitle')}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {t('auth.register.pageSubtitle')}
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-900">
              {t('auth.register.title')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {t('auth.register.description')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RegisterForm
              onSubmit={(data: RegisterFormValues) => registerMutation.mutate(data)}
              isLoading={registerMutation.isPending}
            />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-400">
          {t('auth.hasAccount')}{' '}
          <Link
            to="/login"
            className="font-medium text-accent-green hover:text-accent-green-hover transition-colors"
          >
            {t('auth.loginLink')}
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400">
          {t('common.copyright')}
        </p>
      </div>
    </div>
  )
}
