import logo from '@/assets/logo.svg'
import { RegisterForm } from '@/components/auth/register-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useRegister } from '@/hooks/use-register'
import type { RegisterFormValues } from '@/lib/validators'
import { useAuthStore } from '@/stores/auth-store'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

export default function RegisterPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [isSuccess, setIsSuccess] = useState(false)
  const registerMutation = useRegister()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

  const handleRegister = (data: RegisterFormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-xl space-y-6 rounded-lg bg-white p-12">
        <div className="text-center">
          <img src={logo} alt="asigurari.ro" className="mx-auto mb-4 h-10" />
          <h1 className="text-xl font-bold text-gray-900">Creează un cont</h1>
          <p className="mt-1 text-sm text-gray-400">
            Înregistrează-te pentru a-ți gestiona asigurările
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="text-center">
            {!isSuccess ? (
              <>
                <CardTitle className="text-gray-900">Înregistrare</CardTitle>
                <CardDescription className="text-gray-400">
                  Completează datele de mai jos pentru a crea un cont nou
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-gray-900">
                  Cont creat cu succes!
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Verifică adresa de email pentru a-ți activa contul
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {!isSuccess ? (
              <RegisterForm
                onSubmit={handleRegister}
                isLoading={registerMutation.isPending}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 className="h-16 w-16 text-accent-green animate-bounce" />
                <p className="text-sm text-gray-400 text-center">
                  Am trimis un email de confirmare. Verifică-ți inbox-ul pentru
                  a activa contul.
                </p>
                <Link
                  to="/login"
                  className="mt-2 text-sm font-medium text-accent-green hover:text-accent-green-hover transition-colors"
                >
                  Înapoi la autentificare
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {!isSuccess && (
          <p className="text-center text-sm text-gray-400">
            Ai deja un cont?{' '}
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
