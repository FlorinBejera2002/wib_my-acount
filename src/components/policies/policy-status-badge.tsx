import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PolicyStatus } from "@/api/types";

const statusConfig: Record<PolicyStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Activă",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  EXPIRED: {
    label: "Expirată",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  CANCELLED: {
    label: "Anulată",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  PENDING: {
    label: "În așteptare",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
};

interface PolicyStatusBadgeProps {
  status: PolicyStatus;
}

export function PolicyStatusBadge({ status }: PolicyStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
