import loginHero from '@/assets/login-hero.png'
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
    <div className="flex min-h-dvh bg-zinc-100">
      {/* Image panel — desktop only */}
      <div className="hidden lg:flex lg:flex-1 relative items-center justify-center bg-[#0f172a] p-12">
        <img
          src={loginHero}
          alt=""
          className="max-h-[70vh] w-auto object-contain drop-shadow-xl"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Form panel — fixed narrow width on desktop */}
      <div className="flex flex-col bg-white lg:w-[450px] lg:shrink-0">
        <div className="flex flex-1 flex-col items-center justify-center px-6 sm:px-12">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="pb-2 text-center">
              <img src={logo} alt="asigurari.ro" className="mx-auto h-8 mb-6" />
              <div className="h-px bg-gradient-to-r from-transparent via-blue-800 to-transparent mb-4" />
              <h1 className="text-xl font-bold text-gray-900 pt-8">
                {t('auth.register.title')}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('auth.register.description')}
              </p>
            </div>

            {/* Form section */}
            <div className="py-8">
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
        </div>

        <p className="text-center text-xs text-gray-400 py-4">
          {t('common.copyright')}
        </p>
      </div>
    </div>
  )
}
