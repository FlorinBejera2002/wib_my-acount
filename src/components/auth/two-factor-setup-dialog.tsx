import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useConfirm2FA, useEnable2FA } from '@/hooks/use-two-factor'
import {
  BadgeCheck,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  ShieldCheck,
  Smartphone
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type Step = 'method' | 'qr' | 'confirm' | 'success'
type Method = 'totp' | 'email'

interface TwoFactorSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentMethod?: Method | null
}

export function TwoFactorSetupDialog({
  open,
  onOpenChange,
  currentMethod
}: TwoFactorSetupDialogProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<Method | null>(null)
  const [secret, setSecret] = useState('')
  const [provisioningUri, setProvisioningUri] = useState('')
  const [code, setCode] = useState('')

  const enable2FA = useEnable2FA()
  const confirm2FA = useConfirm2FA()

  useEffect(() => {
    if (!open) {
      setStep('method')
      setMethod(currentMethod ? null : 'totp')
      setSecret('')
      setProvisioningUri('')
      setCode('')
    }
  }, [open, currentMethod])

  useEffect(() => {
    if (code.length === 6 && step === 'confirm') {
      handleConfirm()
    }
  }, [code, step])

  const handleContinue = () => {
    if (!method) return
    enable2FA.mutate(
      { method },
      {
        onSuccess: (data) => {
          if (method === 'email') {
            setStep('success')
          } else {
            setSecret(data.secret ?? '')
            setProvisioningUri(data.provisioningUri ?? '')
            setStep('qr')
          }
        }
      }
    )
  }

  const handleConfirm = () => {
    if (code.length !== 6) return
    confirm2FA.mutate(
      { totp_code: code },
      { onSuccess: () => setStep('success') }
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(secret)
    toast.success(t('twoFactor.setup.secretCopied'))
  }

  const isPending = enable2FA.isPending || confirm2FA.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isPending) onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-md">
        {step === 'method' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {currentMethod
                  ? t('twoFactor.setup.methodTitleChange')
                  : t('twoFactor.setup.methodTitle')}
              </DialogTitle>
              <DialogDescription>
                {currentMethod
                  ? t('twoFactor.setup.methodDescriptionChange')
                  : t('twoFactor.setup.methodDescription')}
              </DialogDescription>
            </DialogHeader>

            {(() => {
              const activeBadge = (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 shrink-0">
                  <BadgeCheck className="h-3 w-3" />
                  {t('twoFactor.setup.activeMethodBadge')}
                </span>
              )

              const totpCard =
                currentMethod === 'totp' ? (
                  <div
                    key="totp"
                    className="w-full flex items-center gap-3 rounded-lg border-2 border-green-500 bg-green-50 p-4 cursor-default"
                  >
                    <Smartphone className="h-5 w-5 shrink-0 text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {t('twoFactor.setup.methodTotp')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('twoFactor.setup.methodTotpDesc')}
                      </p>
                    </div>
                    {activeBadge}
                  </div>
                ) : (
                  <button
                    key="totp"
                    type="button"
                    onClick={() => setMethod('totp')}
                    className={`w-full flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                      method === 'totp'
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone
                      className={`h-5 w-5 shrink-0 ${method === 'totp' ? 'text-primary' : 'text-gray-400'}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t('twoFactor.setup.methodTotp')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('twoFactor.setup.methodTotpDesc')}
                      </p>
                    </div>
                  </button>
                )

              const emailCard =
                currentMethod === 'email' ? (
                  <div
                    key="email"
                    className="w-full flex items-center gap-3 rounded-lg border-2 border-green-500 bg-green-50 p-4 cursor-default"
                  >
                    <Mail className="h-5 w-5 shrink-0 text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {t('twoFactor.setup.methodEmail')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('twoFactor.setup.methodEmailDesc')}
                      </p>
                    </div>
                    {activeBadge}
                  </div>
                ) : (
                  <button
                    key="email"
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`w-full flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                      method === 'email'
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Mail
                      className={`h-5 w-5 shrink-0 ${method === 'email' ? 'text-primary' : 'text-gray-400'}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t('twoFactor.setup.methodEmail')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('twoFactor.setup.methodEmailDesc')}
                      </p>
                    </div>
                  </button>
                )

              const cards =
                currentMethod === 'email'
                  ? [emailCard, totpCard]
                  : [totpCard, emailCard]

              return <div className="space-y-3 py-2">{cards}</div>
            })()}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={handleContinue} disabled={isPending || !method}>
                {enable2FA.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t('twoFactor.setup.continue')}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'qr' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('twoFactor.setup.qrTitle')}</DialogTitle>
              <DialogDescription>
                {t('twoFactor.setup.qrDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="rounded-lg border p-3">
                <QRCodeSVG value={provisioningUri} size={200} />
              </div>
              <div className="w-full space-y-1">
                <p className="text-xs text-gray-500">
                  {t('twoFactor.setup.manualEntry')}
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-gray-100 px-3 py-2 font-mono text-sm tracking-widest break-all">
                    {secret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep('method')}
                disabled={isPending}
              >
                {t('common.back')}
              </Button>
              <Button onClick={() => setStep('confirm')}>
                {t('twoFactor.setup.next')}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('twoFactor.setup.confirmTitle')}</DialogTitle>
              <DialogDescription>
                {t('twoFactor.setup.confirmDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Input
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                className="text-center font-mono text-2xl tracking-[0.5em]"
                autoFocus={true}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep('qr')}
                disabled={isPending}
              >
                {t('common.back')}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={code.length !== 6 || isPending}
              >
                {confirm2FA.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t('twoFactor.setup.verify')}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('twoFactor.setup.successTitle')}</DialogTitle>
              <DialogDescription>
                {t('twoFactor.setup.successDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-6">
              <CheckCircle2 className="h-16 w-16 text-accent-green" />
            </div>
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                {t('twoFactor.setup.done')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
