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
    <div className="flex min-h-dvh flex-col sm:items-center sm:justify-center bg-zinc-100">
      <div className="flex flex-1 flex-col sm:flex-initial w-full sm:max-w-md sm:p-4">
        <div className="flex flex-1 flex-col sm:flex-initial bg-white sm:rounded-xl sm:shadow-sm overflow-hidden">
          {/* Logo */}
          <div className="px-6 pt-6 pb-4 text-center">
            <img src={logo} alt="asigurari.ro" className="mx-auto h-8" />
          </div>

          {/* Gradient banner */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-500 px-6 py-8">
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">
                {t(config.titleKey)}
              </h1>
              {config.descKey && (
                <p className="text-sm text-blue-200 mt-1">
                  {t(config.descKey)}
                </p>
              )}
            </div>
          </div>

          {/* Form section */}
          <div className="flex-1 px-6 py-8 sm:px-8">
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

        <p className="text-center text-xs text-gray-400 py-4">
          {t('common.copyright')}
        </p>
      </div>
    </div>
  )
}
