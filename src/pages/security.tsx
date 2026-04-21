import { TwoFactorDisableDialog } from '@/components/auth/two-factor-disable-dialog'
import { TwoFactorSetupDialog } from '@/components/auth/two-factor-setup-dialog'
import { ActiveSessions } from '@/components/security/active-sessions'
import { ChangePasswordForm } from '@/components/security/change-password-form'
import { LoginHistory } from '@/components/security/login-history'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useProfile } from '@/hooks/use-user'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function TwoFactorSection() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()
  const twoFactorEnabled = profile?.twoFactorEnabled ?? false
  const twoFactorMethod = profile?.twoFactorMethod ?? null
  const [setupOpen, setSetupOpen] = useState(false)
  const [disableOpen, setDisableOpen] = useState(false)

  const methodLabel = twoFactorMethod === 'email'
    ? t('twoFactor.section.enabledMethodEmail')
    : t('twoFactor.section.enabledMethodTotp')

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>{t('twoFactor.section.title')}</CardTitle>
              <CardDescription>{t('twoFactor.section.subtitle')}</CardDescription>
            </div>
            {twoFactorEnabled && (
              <Badge className="bg-green-100 text-green-800 border-0 font-medium">
                {t('twoFactor.section.activeBadge')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {twoFactorEnabled ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck className="h-5 w-5 text-accent-green shrink-0" />
                <span>{methodLabel}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSetupOpen(true)}
                >
                  {t('twoFactor.section.changeMethodBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setDisableOpen(true)}
                >
                  {t('twoFactor.section.disableBtn')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldOff className="h-5 w-5 text-gray-400 shrink-0" />
                {t('twoFactor.section.disabledDescription')}
              </div>
              <Button
                size="sm"
                onClick={() => setSetupOpen(true)}
                className="shrink-0 ml-4"
              >
                {t('twoFactor.section.enableBtn')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TwoFactorSetupDialog open={setupOpen} onOpenChange={setSetupOpen} />
      <TwoFactorDisableDialog open={disableOpen} onOpenChange={setDisableOpen} />
    </>
  )
}

export default function SecurityPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <ChangePasswordForm />
        <TwoFactorSection />
        <LoginHistory />
      </div>
      <ActiveSessions />
    </div>
  )
}
