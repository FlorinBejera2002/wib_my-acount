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
}

export function TwoFactorSetupDialog({
  open,
  onOpenChange
}: TwoFactorSetupDialogProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<Method>('totp')
  const [secret, setSecret] = useState('')
  const [provisioningUri, setProvisioningUri] = useState('')
  const [code, setCode] = useState('')

  const enable2FA = useEnable2FA()
  const confirm2FA = useConfirm2FA()

  useEffect(() => {
    if (!open) {
      setStep('method')
      setMethod('totp')
      setSecret('')
      setProvisioningUri('')
      setCode('')
    }
  }, [open])

  useEffect(() => {
    if (code.length === 6 && step === 'confirm') {
      handleConfirm()
    }
  }, [code])

  const handleContinue = () => {
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
                {t('twoFactor.setup.methodTitle')}
              </DialogTitle>
              <DialogDescription>
                {t('twoFactor.setup.methodDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <button
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

              <button
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
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={handleContinue} disabled={isPending}>
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
