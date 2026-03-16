import type { PolicyDocument } from '@/api/types'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/utils'
import { FileDown, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const typeKeys: Record<PolicyDocument['type'], string> = {
  POLICY: 'policyDocType.POLICY',
  CERTIFICATE: 'policyDocType.CERTIFICATE',
  GREEN_CARD: 'policyDocType.GREEN_CARD',
  RECEIPT: 'policyDocType.RECEIPT'
}

interface PolicyDocumentsProps {
  documents: PolicyDocument[]
}

export function PolicyDocuments({ documents }: PolicyDocumentsProps) {
  const { t } = useTranslation()

  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('policies.noDocuments')}
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
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {t(typeKeys[doc.type])} · {formatFileSize(doc.size)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild={true}>
            <a href={doc.url} download={true}>
              <FileDown className="h-4 w-4" />
            </a>
          </Button>
        </div>
      ))}
    </div>
  )
}
