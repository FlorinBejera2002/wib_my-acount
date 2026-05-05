import logo from '@/assets/logo.svg'
import { RegisterForm } from '@/components/auth/register-form'
import { useRegister } from '@/hooks/use-register'
import type { RegisterFormValues } from '@/lib/validators'
import { useAuthStore } from '@/stores/auth-store'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CircleCheckBig } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

type RegisterStep = 'form' | 'success'

const benefits = [
  { key: 'auth.welcome.benefit1' },
  { key: 'auth.welcome.benefit4' },
  { key: 'auth.welcome.benefit2' },
  { key: 'auth.welcome.benefit3' }
]

export default function RegisterPage() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const registerMutation = useRegister()

  const [step, setStep] = useState<RegisterStep>('form')

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1600)
      return () => clearTimeout(timer)
    }
  }, [step])

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

  const handleSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => setStep('success')
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 lg:p-6">
      {/* Single card split in two halves - exact same as Login */}
      <div className="flex w-full max-w-[1300px] min-h-[700px] overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {/* Left: Form */}
        <div className="flex flex-[1.3] flex-col justify-between px-8 py-10 sm:px-12 lg:px-16">
          <img
            src={logo}
            alt="asigurari.ro"
            className="h-8 w-auto self-start"
          />

          <div className="flex flex-1 items-center">
            <div className="w-full max-w-[400px] py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 'success' ? (
                    <div className="flex flex-col items-center text-center py-4">
                      <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {t('auth.register.successTitle')}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1.5">
                        {t('auth.register.successDescription')}
                      </p>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {t('auth.register.title')}
                      </h1>
                      <p className="text-sm text-gray-400 mt-2 mb-10">
                        {t('auth.register.description')}
                      </p>

                      <RegisterForm
                        onSubmit={handleSubmit}
                        isLoading={registerMutation.isPending}
                      />

                      <p className="mt-6 text-sm text-gray-500">
                        {t('auth.hasAccount')}{' '}
                        <Link
                          to="/login"
                          className="font-semibold text-blue-800 hover:text-blue-900 transition-colors"
                        >
                          {t('auth.loginLink')}
                        </Link>
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p className="text-[11px] text-gray-400">{t('common.copyright')}</p>
        </div>

        {/* Right: Info panel (exact same as Login) */}
        <div className="hidden lg:flex lg:w-4/7 shrink-0 flex-col justify-center bg-blue-50/80 px-12 py-14">
          <h2 className="text-xl font-bold text-gray-900">
            {t('auth.welcome.title')}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mt-2">
            {t('auth.welcome.description')}
          </p>

          <ul className="mt-8 space-y-4">
            {benefits.map(({ key }) => (
              <li key={key} className="flex items-start gap-3 group">
                <CircleCheckBig className="h-4 w-4 text-green-600 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900">
                    {t(`${key}Title`)}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">
                    {t(`${key}Desc`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
