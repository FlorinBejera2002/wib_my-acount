import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useQuotes } from "@/hooks/use-quotes";
import { formatCurrency, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { QuoteStatus } from "@/api/types";

const statusConfig: Record<QuoteStatus, { label: string; dot: string; text: string }> =
  {
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
    CONVERTED: {
      label: "Acceptată",
      dot: "bg-purple-500",
      text: "text-purple-600",
    },
    DRAFT: {
      label: "Schiță",
      dot: "bg-gray-400",
      text: "text-gray-500",
    },
  };

const typeConfig: Record<string, { label: string; className: string }> = {
  RCA: { label: "RCA", className: "bg-blue-100 text-blue-700" },
  CASCO: { label: "CASCO", className: "bg-green-100 text-green-700" },
  CASCO_ECONOM: { label: "CASCO Econom", className: "bg-emerald-100 text-emerald-700" },
  LOCUINTA_PAD: { label: "Locuință PAD", className: "bg-orange-100 text-orange-700" },
  LOCUINTA_FACULTATIVA: { label: "Locuință Facultativă", className: "bg-amber-100 text-amber-700" },
  CALATORIE: { label: "Călătorie", className: "bg-purple-100 text-purple-700" },
  VIATA: { label: "Viață", className: "bg-pink-100 text-pink-700" },
  ASISTENTA_RUTIERA: { label: "Asistență Rutieră", className: "bg-sky-100 text-sky-700" },
  MALPRAXIS: { label: "Malpraxis", className: "bg-red-100 text-red-700" },
  SANATATE: { label: "Sănătate", className: "bg-rose-100 text-rose-700" },
  ACCIDENTE_CALATORI: { label: "Accidente Călători", className: "bg-indigo-100 text-indigo-700" },
  ACCIDENTE_PERSOANE: { label: "Accidente Persoane", className: "bg-violet-100 text-violet-700" },
  ACCIDENTE_TAXI: { label: "Accidente Taxi", className: "bg-slate-100 text-slate-700" },
  CMR: { label: "CMR", className: "bg-cyan-100 text-cyan-700" },
};

export function RecentQuotes() {
  const { data, isLoading } = useQuotes({
    page: 1,
    limit: 5,
    sort: "createdAt",
    order: "desc",
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          Cotații Recente
        </CardTitle>
        <Link
          to="/quotes"
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
            Nu există cotații.
          </p>
        ) : (
          <ul>
            {data?.data.map((quote, i) => {
              const status = statusConfig[quote.status];
              const type = typeConfig[quote.type] || { label: quote.type, className: "bg-gray-100 text-gray-600" };
              const isLast = i === (data?.data.length ?? 0) - 1;

              return (
                <li key={quote.id}>
                  <Link
                    to={`/quotes/${quote.id}`}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 transition-colors hover:bg-gray-50",
                      !isLast && "border-b border-gray-100"
                    )}
                  >
                    <span className={cn("flex h-8 w-fit px-2 shrink-0 items-center justify-center rounded-lg text-xs font-semibold", type.className)}>
                      {type.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {quote.quoteNumber}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {quote.insurerName} &middot;{" "}
                        {formatCurrency(quote.premium)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("flex items-center gap-1.5 text-xs font-medium", status.text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
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
