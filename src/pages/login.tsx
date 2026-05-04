import loginHero from '@/assets/login-hero.png'
import logo from '@/assets/logo.svg'
import { EmailOtpStep } from '@/components/auth/email-otp-step'
import { LoginForm } from '@/components/auth/login-form'
import { TotpStep } from '@/components/auth/totp-step'
import { useLogin, useVerifyTwoFactor } from '@/hooks/use-auth'
import type { LoginFormValues } from '@/lib/validators'
import { useAuthStore } from '@/stores/auth-store'
import { CheckCircle2, LogIn, Shield, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

type LoginStep = 'credentials' | 'two-factor' | 'success'

const stepConfig = {
  credentials: {
    icon: LogIn,
    titleKey: 'auth.login.title',
    descKey: 'auth.login.description'
  },
  'two-factor': {
    icon: Shield,
    titleKey: 'auth.twoFactor.title',
    descKey: ''
  },
  success: {
    icon: ShieldCheck,
    titleKey: 'auth.login.successTitle',
    descKey: 'auth.login.successDescription'
  }
} as const

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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

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
        onSuccess: () => {
          setPreAuthToken('')
          setStep('success')
        },
        onError: (err: unknown) => {
          const status = (err as { response?: { status?: number } })?.response
            ?.status
          const errorCode = (
            err as { response?: { data?: { error?: { code?: string } } } }
          )?.response?.data?.error?.code
          if (errorCode === 'INVALID_PRE_AUTH_TOKEN' || status === 401) {
            handleExpired()
          } else {
            setError(t('auth.twoFactor.invalidCode'))
          }
        }
      }
    )
  }

  const handleExpired = () => {
    setPreAuthToken('')
    setStep('credentials')
  }

  const config = stepConfig[step]

  return (
    <div className="flex min-h-dvh bg-zinc-100">
      {/* Image panel — desktop only, takes remaining space */}
      <div className="hidden lg:flex lg:flex-1 relative items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 p-12">
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
                {t(config.titleKey)}
              </h1>
              {config.descKey && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t(config.descKey)}
                </p>
              )}
            </div>

            {/* Form section */}
            <div className="py-8">
              {step === 'credentials' && (
                <LoginForm
                  onSubmit={handleLogin}
                  isLoading={loginMutation.isPending}
                />
              )}

              {step === 'two-factor' && twoFactorMethod === 'totp' && (
                <TotpStep
                  onSubmit={handleVerify}
                  isLoading={twoFactorMutation.isPending}
                  onExpired={handleExpired}
                />
              )}

              {step === 'two-factor' && twoFactorMethod === 'email' && (
                <EmailOtpStep
                  preAuthToken={preAuthToken}
                  onSubmit={handleVerify}
                  isLoading={twoFactorMutation.isPending}
                  onExpired={handleExpired}
                />
              )}

              {step === 'success' && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <CheckCircle2 className="h-16 w-16 text-accent-green animate-bounce" />
                  <p className="text-sm text-muted-foreground">
                    {t('auth.login.preparingDashboard')}
                  </p>
                </div>
              )}

              {step === 'credentials' && (
                <div className="mt-6 space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('auth.noAccount')}{' '}
                    <Link
                      to="/register"
                      className="font-medium text-blue-800 hover:text-blue-900 transition-colors"
                    >
                      {t('auth.createAccountLink')}
                    </Link>
                  </p>
                  <p className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-blue-800 hover:text-blue-900 transition-colors"
                    >
                      {t('auth.forgotPassword')}
                    </Link>
                  </p>
                </div>
              )}
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
