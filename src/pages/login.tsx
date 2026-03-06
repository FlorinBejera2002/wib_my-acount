import logo from '@/assets/logo.svg'
import { LoginForm } from '@/components/auth/login-form'
import { LoginProgress } from '@/components/auth/login-progress'
import { TwoFactorForm } from '@/components/auth/two-factor-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useLogin, useVerifyTwoFactor } from '@/hooks/use-auth'
import type { LoginFormValues } from '@/lib/validators'
import { useAuthStore } from '@/stores/auth-store'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

type LoginStep = 'credentials' | 'two-factor' | 'success'

export default function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [step, setStep] = useState<LoginStep>('credentials')
  const [tempToken, setTempToken] = useState('')

  const loginMutation = useLogin()
  const twoFactorMutation = useVerifyTwoFactor()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

  const handleLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.requiresTwoFactor && response.tempToken) {
          setTempToken(response.tempToken)
          setStep('two-factor')
        }
      }
    })
  }

  const handleTwoFactor = (code: string) => {
    twoFactorMutation.mutate(
      { tempToken, code },
      {
        onSuccess: () => {
          setStep('success')
        }
      }
    )
  }

  const stepIndex = step === 'credentials' ? 0 : step === 'two-factor' ? 1 : 2

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-xl space-y-6 rounded-lg bg-white p-12">
        <div className="text-center">
          <img src={logo} alt="asigurari.ro" className="mx-auto mb-4 h-10" />
          <h1 className="text-xl font-bold text-gray-900">Bine ai venit!</h1>
          <p className="mt-1 text-sm text-gray-400">
            Autentifică-te în contul tău de asigurări
          </p>
        </div>

        <LoginProgress currentStep={stepIndex} />

        <Card className="shadow-sm">
          <CardHeader className="text-center">
            {step === 'credentials' && (
              <>
                <CardTitle className="text-gray-900">Autentificare</CardTitle>
                <CardDescription className="text-gray-400">
                  Introdu adresa de email și parola pentru a continua
                </CardDescription>
              </>
            )}
            {step === 'two-factor' && (
              <>
                <CardTitle className="text-gray-900">
                  Verificare în doi pași
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Am trimis un cod de verificare pe adresa ta de email
                </CardDescription>
              </>
            )}
            {step === 'success' && (
              <>
                <CardTitle className="text-gray-900">
                  Autentificare reușită!
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Vei fi redirecționat către panoul principal...
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {step === 'credentials' && (
              <LoginForm
                onSubmit={handleLogin}
                isLoading={loginMutation.isPending}
              />
            )}

            {step === 'two-factor' && (
              <TwoFactorForm
                onSubmit={handleTwoFactor}
                isLoading={twoFactorMutation.isPending}
              />
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 className="h-16 w-16 text-accent-green animate-bounce" />
                <p className="text-sm text-gray-400">
                  Pregătim panoul tău de control...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          © Copyright 2026 Asigurari.ro - A Trading Style of Wilson Insurance
          Broker SRL
        </p>
      </div>
    </div>
  )
}
