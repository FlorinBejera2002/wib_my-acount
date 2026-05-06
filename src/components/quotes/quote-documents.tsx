import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function QuoteDocuments() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <FileText className="h-8 w-8 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">{t('quotes.noDocuments')}</p>
    </div>
  )
}
