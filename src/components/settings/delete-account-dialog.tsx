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
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function DeleteAccountDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const canDelete = confirmation === t('settings.confirmPhrase')

  const handleDelete = async () => {
    setIsDeleting(true)
    // TODO: API call pentru ștergere cont
    await new Promise((r) => setTimeout(r, 1000))
    setIsDeleting(false)
    setOpen(false)
    toast.success(t('toast.deleteRequestSent'))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">{t('settings.warning')}</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>{t('settings.deleteWarning1')}</li>
              <li>{t('settings.deleteWarning2')}</li>
              <li>{t('settings.deleteWarning3')}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmation"
              dangerouslySetInnerHTML={{ __html: t('settings.confirmLabel') }}
            />
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={t('settings.confirmPhrase')}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || isDeleting}
          >
            {isDeleting ? (
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
