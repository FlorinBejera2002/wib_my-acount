import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { QuoteStatus } from "@/api/types";

const statusConfig: Record<QuoteStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Activă",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  EXPIRED: {
    label: "Expirată",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  CONVERTED: {
    label: "Convertită",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  DRAFT: {
    label: "Ciornă",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
};

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
