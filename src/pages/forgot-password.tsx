import logo from '@/assets/logo.svg'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { TwoFactorForm } from '@/components/auth/two-factor-form'
import {
  useForgotPassword,
  useResetPassword,
  useVerifyResetCode
} from '@/hooks/use-forgot-password'
import type {
  ForgotPasswordFormValues,
  ResetPasswordFormValues
} from '@/lib/validators'
import { useAuthStore } from '@/stores/auth-store'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  CircleCheckBig,
  KeyRound,
  Lock,
  Mail
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useSearchParams } from 'react-router-dom'

type ResetStep = 'email' | 'verify-code' | 'new-password' | 'success'

const stepConfig = {
  email: {
    icon: Mail,
    titleKey: 'auth.forgotPasswordForm.title',
    descKey: 'auth.forgotPasswordForm.description'
  },
  'verify-code': {
    icon: KeyRound,
    titleKey: 'auth.verifyCode.title',
    descKey: 'auth.verifyCode.description'
  },
  'new-password': {
    icon: Lock,
    titleKey: 'auth.newPassword.title',
    descKey: 'auth.newPassword.description'
  },
  success: {
    icon: CheckCircle2,
    titleKey: 'auth.resetPassword.successTitle',
    descKey: 'auth.resetPassword.successDescription'
  }
} as const

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [searchParams, setSearchParams] = useSearchParams()
  const validSteps: ResetStep[] = ['email', 'verify-code', 'new-password', 'success']
  const stepParam = searchParams.get('step')
  const step: ResetStep = validSteps.includes(stepParam as ResetStep)
    ? (stepParam as ResetStep)
    : 'email'
  const email = searchParams.get('email') || ''
  const [resetToken, setResetToken] = useState('')

  const forgotPasswordMutation = useForgotPassword()
  const verifyResetCodeMutation = useVerifyResetCode()
  const resetPasswordMutation = useResetPassword()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

  const handleForgotPassword = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setSearchParams({ step: 'verify-code', email: data.email }, { replace: true })
      }
    })
  }

  const handleVerifyCode = (code: string) => {
    verifyResetCodeMutation.mutate(
      { email, code },
      {
        onSuccess: (response) => {
          setResetToken(response.resetToken)
          setSearchParams({ step: 'new-password', email }, { replace: true })
        }
      }
    )
  }

  const handleResetPassword = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(
      {
        reset_token: resetToken,
        new_password: data.newPassword
      },
      {
        onSuccess: () => {
          setSearchParams({ step: 'success' }, { replace: true })
        }
      }
    )
  }

  const config = stepConfig[step]

  const benefits = [
    { key: 'auth.welcome.benefit1' },
    { key: 'auth.welcome.benefit4' },
    { key: 'auth.welcome.benefit2' },
    { key: 'auth.welcome.benefit3' }
  ]

  return (
    <div className="flex min-h-screen lg:items-center lg:justify-center bg-white lg:bg-zinc-50 p-0 lg:p-6">
      {/* Same card as Login */}
      <div className="flex w-full lg:max-w-[1300px] min-h-screen lg:min-h-[700px] overflow-hidden lg:rounded-xl bg-white lg:shadow-sm lg:border lg:border-gray-100">
        {/* Left: Form Side */}
        <div className="flex flex-[1.3] flex-col justify-between px-8 py-10 sm:px-12 lg:px-16">
          <img
            src={logo}
            alt="asigurari.ro"
            className="h-8 w-auto self-center md:self-start"
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
                        {t(config.titleKey)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1.5">
                        {t(config.descKey)}
                      </p>
                      <Link
                        to="/login"
                        className="mt-6 inline-block text-sm font-medium text-blue-800 hover:text-blue-900 transition-colors"
                      >
                        {t('auth.loginLink')}
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {t(config.titleKey)}
                        </h1>
                        <p className="text-sm text-gray-400 mt-2">
                          {t(config.descKey)}
                        </p>
                      </div>

                      {step === 'email' && (
                        <ForgotPasswordForm
                          onSubmit={handleForgotPassword}
                          isLoading={forgotPasswordMutation.isPending}
                        />
                      )}

                      {step === 'verify-code' && (
                        <TwoFactorForm
                          onSubmit={handleVerifyCode}
                          isLoading={verifyResetCodeMutation.isPending}
                          preAuthToken={''}
                          onResend={() =>
                            forgotPasswordMutation.mutate({ email })
                          }
                          isResending={forgotPasswordMutation.isPending}
                        />
                      )}

                      {step === 'new-password' && (
                        <ResetPasswordForm
                          onSubmit={handleResetPassword}
                          isLoading={resetPasswordMutation.isPending}
                        />
                      )}

                      <p className="mt-6 text-sm text-gray-500 text-center">
                        {t('auth.rememberedPassword')}{' '}
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

        {/* Right: Info Panel — identical to Login */}
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
