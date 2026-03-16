import type { QuoteDocument } from '@/api/types'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/utils'
import { FileDown, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const typeKeys: Record<QuoteDocument['type'], string> = {
  OFFER: 'quoteDocType.OFFER',
  COMPARISON: 'quoteDocType.COMPARISON',
  TERMS: 'quoteDocType.TERMS'
}

interface QuoteDocumentsProps {
  documents: QuoteDocument[]
}

export function QuoteDocuments({ documents }: QuoteDocumentsProps) {
  const { t } = useTranslation()

  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('quotes.noDocuments')}
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-blue-900" />
            <div>
              <p className="text-sm font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {t(typeKeys[doc.type])} · {formatFileSize(doc.size)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild={true}>
            <a href={doc.url} download={true}>
              <FileDown className="h-5 w-5 text-green-500" />
            </a>
          </Button>
        </div>
      ))}
    </div>
  )
}
