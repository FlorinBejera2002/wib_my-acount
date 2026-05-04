import logo from '@/assets/logo.svg'
import { RegisterForm } from '@/components/auth/register-form'
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
    <div className="flex min-h-dvh flex-col sm:items-center sm:justify-center bg-zinc-100">
      <div className="flex flex-1 flex-col sm:flex-initial w-full sm:max-w-md sm:p-4">
        <div className="flex flex-1 flex-col sm:flex-initial bg-white sm:rounded-xl sm:shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-8 pb-2 text-center">
            <img src={logo} alt="asigurari.ro" className="mx-auto h-8 mb-6" />
            <div>
              <div className="h-px bg-gradient-to-r from-transparent via-blue-800 to-transparent mb-4" />
              <h1 className="text-xl font-bold text-gray-900">
                {t('auth.register.title')}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('auth.register.description')}
            </p>
          </div>

          {/* Form section */}
          <div className="flex-1 px-6 py-8 sm:px-8">
            <RegisterForm
              onSubmit={(data: RegisterFormValues) =>
                registerMutation.mutate(data)
              }
              isLoading={registerMutation.isPending}
            />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t('auth.hasAccount')}{' '}
              <Link
                to="/login"
                className="font-medium text-blue-800 hover:text-blue-900 transition-colors"
              >
                {t('auth.loginLink')}
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 py-4">
          {t('common.copyright')}
        </p>
      </div>
    </div>
  )
}
