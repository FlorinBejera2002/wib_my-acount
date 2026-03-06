import type { QuoteDocument } from '@/api/types'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/utils'
import { FileDown, FileText } from 'lucide-react'

const typeLabels: Record<QuoteDocument['type'], string> = {
  OFFER: 'Ofertă',
  COMPARISON: 'Comparare',
  TERMS: 'Termeni și condiții'
}

interface QuoteDocumentsProps {
  documents: QuoteDocument[]
}

export function QuoteDocuments({ documents }: QuoteDocumentsProps) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nu sunt documente disponibile
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
                {typeLabels[doc.type]} · {formatFileSize(doc.size)}
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
