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
import { Link, Navigate } from 'react-router-dom'

type ResetStep = 'email' | 'verify-code' | 'new-password' | 'success'

export default function ForgotPasswordPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [step, setStep] = useState<ResetStep>('email')
  const [tempToken, setTempToken] = useState('')
  const [resetToken, setResetToken] = useState('')

  const forgotPasswordMutation = useForgotPassword()
  const verifyResetCodeMutation = useVerifyResetCode()
  const resetPasswordMutation = useResetPassword()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

  const handleForgotPassword = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: (response) => {
        setTempToken(response.tempToken)
        setStep('verify-code')
      }
    })
  }

  const handleVerifyCode = (code: string) => {
    verifyResetCodeMutation.mutate(
      { tempToken, code },
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
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
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
      <div className="w-full max-w-xl space-y-6 rounded-lg bg-white p-12">
        <div className="text-center">
          <img src={logo} alt="asigurari.ro" className="mx-auto mb-4 h-10" />
          <h1 className="text-xl font-bold text-gray-900">Resetare parolă</h1>
          <p className="mt-1 text-sm text-gray-400">
            Urmează pașii de mai jos pentru a-ți reseta parola
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="text-center">
            {step === 'email' && (
              <>
                <CardTitle className="text-gray-900">
                  Am uitat parola
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Introdu adresa de email asociată contului tău
                </CardDescription>
              </>
            )}
            {step === 'verify-code' && (
              <>
                <CardTitle className="text-gray-900">
                  Verificare cod
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Am trimis un cod de verificare pe adresa ta de email
                </CardDescription>
              </>
            )}
            {step === 'new-password' && (
              <>
                <CardTitle className="text-gray-900">Parolă nouă</CardTitle>
                <CardDescription className="text-gray-400">
                  Alege o parolă nouă pentru contul tău
                </CardDescription>
              </>
            )}
            {step === 'success' && (
              <>
                <CardTitle className="text-gray-900">
                  Parola a fost resetată!
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Acum te poți autentifica cu noua parolă
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
                  Parola ta a fost actualizată cu succes.
                </p>
                <Link
                  to="/login"
                  className="mt-2 text-sm font-medium text-accent-green hover:text-accent-green-hover transition-colors"
                >
                  Autentifică-te
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {step !== 'success' && (
          <p className="text-center text-sm text-gray-400">
            Ți-ai amintit parola?{' '}
            <Link
              to="/login"
              className="font-medium text-accent-green hover:text-accent-green-hover transition-colors"
            >
              Autentifică-te
            </Link>
          </p>
        )}

        <p className="text-center text-xs text-gray-400">
          © Copyright 2026 Asigurari.ro - A Trading Style of Wilson Insurance
          Broker SRL
        </p>
      </div>
    </div>
  )
}
