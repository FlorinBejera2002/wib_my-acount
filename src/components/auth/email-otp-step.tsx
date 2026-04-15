import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResend2FACode } from '@/hooks/use-two-factor'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface EmailOtpStepProps {
  preAuthToken: string
  onSubmit: (code: string, setError: (msg: string) => void) => void
  isLoading: boolean
  onExpired: () => void
}

const RESEND_COOLDOWN = 60

export function EmailOtpStep({ preAuthToken, onSubmit, isLoading, onExpired }: EmailOtpStepProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resend = useResend2FACode()

  useEffect(() => {
    startCountdown()
    return () => clearCountdown()
  }, [])

  const startCountdown = () => {
    clearCountdown()
    setCountdown(RESEND_COOLDOWN)
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearCountdown()
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const clearCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleSubmit = () => {
    if (code.length !== 6) return
    setError('')
    onSubmit(code, setError)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(val)
    if (error) setError('')
  }

  const handleResend = () => {
    resend.mutate(
      { pre_auth_token: preAuthToken },
      {
        onSuccess: () => {
          startCountdown()
          setCode('')
        },
        onError: (err: unknown) => {
          const status = (err as { response?: { status?: number } })?.response?.status
          if (status === 422) {
            toast.error(t('auth.twoFactor.sessionExpired'))
            onExpired()
            navigate('/login')
          }
        }
      }
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">
        {t('auth.twoFactor.emailDescription')}
      </p>

      <Input
        value={code}
        onChange={handleChange}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
        placeholder="000000"
        maxLength={6}
        inputMode="numeric"
        className="text-center font-mono text-2xl tracking-[0.5em]"
        autoFocus={true}
        disabled={isLoading}
      />

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={code.length !== 6 || isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {t('auth.twoFactor.verify')}
      </Button>

      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-gray-400">
            {t('auth.twoFactor.resendIn', { seconds: countdown })}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resend.isPending}
            className="text-sm font-medium text-accent-green hover:text-accent-green-hover transition-colors disabled:opacity-50"
          >
            {resend.isPending ? (
              <span className="flex items-center gap-1 justify-center">
                <Loader2 className="h-3 w-3 animate-spin" />
                {t('auth.twoFactor.resending')}
              </span>
            ) : (
              t('auth.twoFactor.resendCode')
            )}
          </button>
        )}
      </div>
    </div>
  )
}
