import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface PasswordStrengthProps {
  password: string
}

function calculateStrength(password: string): {
  score: number
  labelKey: string
  color: string
} {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { score: 1, labelKey: 'security.passwordStrength.weak', color: 'bg-red-500' }
  if (score <= 3)
    return { score: 2, labelKey: 'security.passwordStrength.fair', color: 'bg-orange-500' }
  if (score <= 4) return { score: 3, labelKey: 'security.passwordStrength.good', color: 'bg-yellow-500' }
  return { score: 4, labelKey: 'security.passwordStrength.strong', color: 'bg-green-500' }
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { t } = useTranslation()

  if (!password) return null

  const { score, labelKey, color } = calculateStrength(password)
  const label = t(labelKey)

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              level <= score ? color : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p
        className="text-xs text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: t('security.passwordStrength.label', { label })
        }}
      />
    </div>
  )
}
