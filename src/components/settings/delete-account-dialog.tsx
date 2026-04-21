import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteAccount } from '@/hooks/use-user'
import { AlertTriangle, Eye, EyeOff, Info, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function DeleteAccountDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const deleteAccount = useDeleteAccount()

  const canDelete = password.length > 0

  const handleDelete = () => {
    deleteAccount.mutate(password, {
      onSuccess: () => {
        toast.success(t('toast.deleteRequestSent'))
        setOpen(false)
        setPassword('')
      }
    })
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) {
      setPassword('')
      setShowPassword(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild={true}>
        <Button variant="destructive">{t('settings.deleteAccount')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t('settings.deleteAccountTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('settings.deleteAccountDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p>{t('settings.processInfo1')}</p>
                <p>{t('settings.processInfo2')}</p>
                <p>{t('settings.processInfo3')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-password">
              {t('settings.passwordConfirmLabel')}
            </Label>
            <div className="relative">
              <Input
                id="delete-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || deleteAccount.isPending}
          >
            {deleteAccount.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('settings.processing')}
              </>
            ) : (
              t('settings.confirmDelete')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
