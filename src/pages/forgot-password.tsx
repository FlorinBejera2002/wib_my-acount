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
import { CheckCircle2, KeyRound, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

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
  const [step, setStep] = useState<ResetStep>('email')
  const [email, setEmail] = useState('')
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
        setEmail(data.email)
        setStep('verify-code')
      }
    })
  }

  const handleVerifyCode = (code: string) => {
    verifyResetCodeMutation.mutate(
      { email, code },
      {
        onSuccess: (response) => {
          setResetToken(response.resetToken)
          setStep('new-password')
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
          setStep('success')
        }
      }
    )
  }

  const config = stepConfig[step]
  const StepIcon = config.icon

  return (
    <div className="flex min-h-dvh flex-col sm:items-center sm:justify-center bg-zinc-100">
      <div className="flex flex-1 flex-col sm:flex-initial w-full sm:max-w-md sm:p-4">
        <div className="flex flex-1 flex-col sm:flex-initial bg-white sm:rounded-xl sm:shadow-sm overflow-hidden">
          {/* Gradient banner */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-500 px-6 py-10">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <StepIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                {t(config.titleKey)}
              </h1>
              <p className="text-sm text-blue-200 mt-1">
                {t(config.descKey)}
              </p>
            </div>
          </div>

          {/* Form section */}
          <div className="flex-1 px-6 py-8 sm:px-8">
            <div className="text-center mb-6">
              <img src={logo} alt="asigurari.ro" className="mx-auto h-8" />
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
              />
            )}

            {step === 'new-password' && (
              <ResetPasswordForm
                onSubmit={handleResetPassword}
                isLoading={resetPasswordMutation.isPending}
              />
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 className="h-16 w-16 text-accent-green animate-bounce" />
                <p className="text-sm text-muted-foreground">
                  {t('auth.resetPassword.successMessage')}
                </p>
                <Link
                  to="/login"
                  className="mt-2 text-sm font-medium text-blue-800 hover:text-blue-900 transition-colors"
                >
                  {t('auth.loginLink')}
                </Link>
              </div>
            )}

            {step !== 'success' && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {t('auth.rememberedPassword')}{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-800 hover:text-blue-900 transition-colors"
                >
                  {t('auth.loginLink')}
                </Link>
              </p>
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
