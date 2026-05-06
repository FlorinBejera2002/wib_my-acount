import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TotpStepProps {
  onSubmit: (code: string, setError: (msg: string) => void) => void
  isLoading: boolean
  onExpired: () => void
}

export function TotpStep({
  onSubmit,
  isLoading,
  onExpired: _onExpired
}: TotpStepProps) {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

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

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">
        {t('auth.twoFactor.totpDescription')}
      </p>

      <Input
        value={code}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
        }}
        placeholder="000000"
        maxLength={6}
        inputMode="numeric"
        className="text-center font-mono text-2xl tracking-[0.5em]"
        autoFocus={true}
        disabled={isLoading}
      />

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={code.length !== 6 || isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {t('auth.twoFactor.verify')}
      </Button>
    </div>
  )
}
