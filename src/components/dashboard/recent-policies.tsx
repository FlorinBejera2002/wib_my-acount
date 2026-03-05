import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { usePolicies } from "@/hooks/use-policies";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PolicyStatus } from "@/api/types";

const statusConfig: Record<
  PolicyStatus,
  { label: string; dot: string; text: string }
> = {
  ACTIVE: {
    label: "Activă",
    dot: "bg-accent-green",
    text: "text-accent-green",
  },
  EXPIRED: {
    label: "Expirată",
    dot: "bg-red-500",
    text: "text-red-600",
  },
  CANCELLED: {
    label: "Anulată",
    dot: "bg-red-500",
    text: "text-red-600",
  },
  PENDING: {
    label: "În așteptare",
    dot: "bg-amber-500",
    text: "text-amber-600",
  },
};

function formatDaysUntilExpiry(days: number): string {
  if (days < 0) return "Expirată";
  if (days === 0) return "Expiră azi";
  if (days === 1) return "Expiră mâine";
  return `${days} zile rămase`;
}

export function RecentPolicies() {
  const { data, isLoading } = usePolicies({
    page: 1,
    limit: 5,
    sort: "createdAt",
    order: "desc",
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          Polițe Recente
        </CardTitle>
        <Link
          to="/policies"
          className="flex items-center gap-1 text-xs font-medium text-accent-green hover:text-accent-green-hover transition-colors"
        >
          Vezi toate
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="space-y-1 px-6 pb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-400">
            Nu există polițe.
          </p>
        ) : (
          <ul>
            {data?.data.map((policy, i) => {
              const status = statusConfig[policy.status];
              const isLast = i === (data?.data.length ?? 0) - 1;

              return (
                <li key={policy.id}>
                  <Link
                    to={`/policies/${policy.id}`}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 transition-colors hover:bg-gray-50",
                      !isLast && "border-b border-gray-100"
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">
                      {policy.type.slice(0, 3)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {policy.policyNumber}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {policy.insurerName}
                        {policy.vehicleOrProperty &&
                          ` · ${policy.vehicleOrProperty}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className={cn("flex items-center gap-1.5 text-xs font-medium", status.text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                      {policy.status === "ACTIVE" && (
                        <span
                          className={cn(
                            "text-[11px]",
                            policy.daysUntilExpiry <= 30
                              ? "font-medium text-amber-600"
                              : "text-gray-400"
                          )}
                        >
                          {formatDaysUntilExpiry(policy.daysUntilExpiry)}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
