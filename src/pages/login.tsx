import logo from '@/assets/logo.svg'
import { EmailOtpStep } from '@/components/auth/email-otp-step'
import { LoginForm } from '@/components/auth/login-form'
import { TotpStep } from '@/components/auth/totp-step'
import { useLogin, useVerifyTwoFactor } from '@/hooks/use-auth'
import type { LoginFormValues } from '@/lib/validators'
import { useAuthStore } from '@/stores/auth-store'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  CheckCircle2,
  CircleCheckBig,
  ClockArrowUp,
  FileText,
  ShieldCheck
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

type LoginStep = 'credentials' | 'two-factor' | 'success'

const benefits = [
  { icon: FileText, key: 'auth.welcome.benefit1' },
  { icon: ClockArrowUp, key: 'auth.welcome.benefit4' },
  { icon: Bell, key: 'auth.welcome.benefit2' },
  { icon: ShieldCheck, key: 'auth.welcome.benefit3' }
] as const

export default function LoginPage() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [step, setStep] = useState<LoginStep>('credentials')
  const [preAuthToken, setPreAuthToken] = useState('')
  const [twoFactorMethod, setTwoFactorMethod] = useState<'totp' | 'email'>(
    'totp'
  )

  const loginMutation = useLogin()
  const twoFactorMutation = useVerifyTwoFactor()

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1600)
      return () => clearTimeout(timer)
    }
  }, [step])

  if (isAuthenticated) return <Navigate to="/dashboard" replace={true} />

  const handleLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.requires_2fa && response.preAuthToken) {
          setPreAuthToken(response.preAuthToken)
          setTwoFactorMethod(response.twoFactorMethod ?? 'totp')
          setStep('two-factor')
        }
      }
    })
  }

  const handleVerify = (code: string, setError: (msg: string) => void) => {
    twoFactorMutation.mutate(
      { pre_auth_token: preAuthToken, totp_code: code },
      {
        onSuccess: () => setStep('success'),
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onError: (err: any) => {
          if (err?.response?.status === 401) setStep('credentials')
          else setError(t('auth.twoFactor.invalidCode'))
        }
      }
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white lg:bg-zinc-50 p-0 lg:p-6">
      {/* ── Single card split in two halves ── */}
      <div className="flex w-full lg:max-w-[1300px] min-h-screen lg:min-h-[700px] overflow-hidden lg:rounded-xl bg-white lg:shadow-sm lg:border lg:border-gray-100">
        {/* ── Left: Form ── */}
        <div className="flex flex-[1.3] flex-col justify-between px-8 py-10 sm:px-12 lg:px-16">
          <img src={logo} alt="WIB" className="h-8 w-auto self-start" />

          <div className="flex flex-1 items-center w-full">
            <div className="w-full py-8">
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
                        {t('auth.login.successTitle')}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1.5">
                        {t('auth.login.successDescription')}
                      </p>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {step === 'credentials'
                          ? t('auth.login.title')
                          : t('auth.twoFactor.title')}
                      </h1>
                      <p className="text-sm text-gray-400 mt-2 mb-10">
                        {step === 'credentials'
                          ? t('auth.login.description')
                          : twoFactorMethod === 'totp'
                            ? t('auth.twoFactor.totpDescription')
                            : t('auth.twoFactor.emailDescription')}
                      </p>

                      {step === 'credentials' && (
                        <LoginForm
                          onSubmit={handleLogin}
                          isLoading={loginMutation.isPending}
                        />
                      )}

                      {step === 'two-factor' &&
                        (twoFactorMethod === 'totp' ? (
                          <TotpStep
                            onSubmit={handleVerify}
                            isLoading={twoFactorMutation.isPending}
                            onExpired={() => setStep('credentials')}
                          />
                        ) : (
                          <EmailOtpStep
                            preAuthToken={preAuthToken}
                            onSubmit={handleVerify}
                            isLoading={twoFactorMutation.isPending}
                            onExpired={() => setStep('credentials')}
                          />
                        ))}

                      {step === 'credentials' && (
                        <p className="mt-6 text-sm text-gray-500">
                          {t('auth.noAccount')}{' '}
                          <Link
                            to="/register"
                            className="font-semibold text-blue-800 hover:text-blue-900 transition-colors"
                          >
                            {t('auth.createAccountLink')}
                          </Link>
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p className="text-[11px] text-gray-400">{t('common.copyright')}</p>
        </div>

        {/* ── Right: Info panel ── */}
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
