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
import { Label } from '@/components/ui/label'
import { useDisable2FA } from '@/hooks/use-two-factor'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TwoFactorDisableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TwoFactorDisableDialog({
  open,
  onOpenChange
}: TwoFactorDisableDialogProps) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const disable2FA = useDisable2FA()

  const handleDisable = () => {
    disable2FA.mutate(
      { password },
      {
        onSuccess: () => {
          setPassword('')
          onOpenChange(false)
        }
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!disable2FA.isPending) {
          setPassword('')
          onOpenChange(o)
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('twoFactor.disable.title')}</DialogTitle>
          <DialogDescription>
            {t('twoFactor.disable.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="disable-password">
            {t('security.currentPassword')}
          </Label>
          <Input
            id="disable-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password) handleDisable()
            }}
            autoComplete="current-password"
            autoFocus={true}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setPassword('')
              onOpenChange(false)
            }}
            disabled={disable2FA.isPending}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDisable}
            disabled={!password || disable2FA.isPending}
          >
            {disable2FA.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t('twoFactor.disable.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
