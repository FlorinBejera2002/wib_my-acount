import logo from '@/assets/logo.svg'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { TwoFactorForm } from '@/components/auth/two-factor-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

type ResetStep = 'email' | 'verify-code' | 'new-password' | 'success'

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-xl space-y-6 rounded-lg bg-white p-6 sm:p-12">
        <div className="text-center">
          <img src={logo} alt="asigurari.ro" className="mx-auto mb-4 h-10" />
          <h1 className="text-xl font-bold text-gray-900">
            {t('auth.resetPassword.pageTitle')}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {t('auth.resetPassword.pageSubtitle')}
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="text-center">
            {step === 'email' && (
              <>
                <CardTitle className="text-gray-900">
                  {t('auth.forgotPasswordForm.title')}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.forgotPasswordForm.description')}
                </CardDescription>
              </>
            )}
            {step === 'verify-code' && (
              <>
                <CardTitle className="text-gray-900">
                  {t('auth.verifyCode.title')}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.verifyCode.description')}
                </CardDescription>
              </>
            )}
            {step === 'new-password' && (
              <>
                <CardTitle className="text-gray-900">
                  {t('auth.newPassword.title')}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.newPassword.description')}
                </CardDescription>
              </>
            )}
            {step === 'success' && (
              <>
                <CardTitle className="text-gray-900">
                  {t('auth.resetPassword.successTitle')}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t('auth.resetPassword.successDescription')}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
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
                <p className="text-sm text-gray-400">
                  {t('auth.resetPassword.successMessage')}
                </p>
                <Link
                  to="/login"
                  className="mt-2 text-sm font-medium text-accent-green hover:text-accent-green-hover transition-colors"
                >
                  {t('auth.loginLink')}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {step !== 'success' && (
          <p className="text-center text-sm text-gray-400">
            {t('auth.rememberedPassword')}{' '}
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
