import { FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import type { QuoteDocument } from "@/api/types";

const typeLabels: Record<QuoteDocument["type"], string> = {
  OFFER: "Ofertă",
  COMPARISON: "Comparare",
  TERMS: "Termeni și condiții",
};

interface QuoteDocumentsProps {
  documents: QuoteDocument[];
}

export function QuoteDocuments({ documents }: QuoteDocumentsProps) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nu sunt documente disponibile
      </p>
    );
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
                {typeLabels[doc.type]} · {formatFileSize(doc.size)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a href={doc.url} download>
              <FileDown className="h-4 w-4" />
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
}
