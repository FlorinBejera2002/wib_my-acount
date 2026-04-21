import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface LoginProgressProps {
  currentStep: number
}

export function LoginProgress({ currentStep }: LoginProgressProps) {
  const { t } = useTranslation()

  const steps = [
    { labelKey: 'auth.loginStep' },
    { labelKey: 'auth.twoFactorStep' },
    { labelKey: 'auth.connectStep' }
  ]

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step.labelKey} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                index < currentStep
                  ? 'bg-primary text-white'
                  : index === currentStep
                    ? 'bg-primary text-white ring-2 ring-primary/30 ring-offset-2'
                    : 'bg-gray-100 text-gray-400'
              )}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={cn(
                'hidden text-xs sm:inline',
                index <= currentStep
                  ? 'font-medium text-gray-900'
                  : 'text-gray-400'
              )}
            >
              {t(step.labelKey)}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'h-px w-8 transition-colors',
                index < currentStep ? 'bg-primary' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
