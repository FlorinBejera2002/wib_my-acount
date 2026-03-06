import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Banknote,
  FileText,
  Shield,
  CalendarRange,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteDocuments } from "./quote-documents";
import { useQuote } from "@/hooks/use-quotes";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { VehicleBrandLogo } from "@/components/ui/vehicle-brand-logo";
import type { QuoteStatus } from "@/api/types";

const typeLabels: Record<string, string> = {
  RCA: "RCA",
  CASCO: "CASCO",
  CASCO_ECONOM: "CASCO Econom",
  LOCUINTA_PAD: "Locuință PAD",
  LOCUINTA_FACULTATIVA: "Locuință Facultativă",
  CALATORIE: "Călătorie",
  VIATA: "Viață",
  ASISTENTA_RUTIERA: "Asistență Rutieră",
  MALPRAXIS: "Malpraxis",
  SANATATE: "Sănătate",
  ACCIDENTE_CALATORI: "Accidente Călători",
  ACCIDENTE_PERSOANE: "Accidente Persoane",
  ACCIDENTE_TAXI: "Accidente Taxi",
  CMR: "CMR",
};

const typeConfig: Record<string, { badge: string; iconBg: string; iconText: string }> = {
  RCA: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  CASCO: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  CASCO_ECONOM: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  LOCUINTA_PAD: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  LOCUINTA_FACULTATIVA: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  CALATORIE: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  VIATA: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  ASISTENTA_RUTIERA: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  MALPRAXIS: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  SANATATE: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  ACCIDENTE_CALATORI: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  ACCIDENTE_PERSOANE: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  ACCIDENTE_TAXI: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
  CMR: { badge: "bg-green-100 text-green-700", iconBg: "bg-green-50", iconText: "text-green-600" },
};

const statusConfig: Record<QuoteStatus, { label: string; dot: string; text: string }> = {
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

const defaultType = {
  badge: "bg-gray-100 text-gray-600",
  iconBg: "bg-gray-50",
  iconText: "text-gray-600",
};

export function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: quote, isLoading, isError } = useQuote(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-12 w-full rounded-lg" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg font-medium">Cotația nu a fost găsită</p>
        <Button asChild variant="outline">
          <Link to="/quotes">Înapoi la cotații</Link>
        </Button>
      </div>
    );
  }

  const type = typeConfig[quote.type] || defaultType;
  const status = statusConfig[quote.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/quotes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{quote.quoteNumber}</h1>
            <span className={cn("inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold", type.badge)}>
              {typeLabels[quote.type]}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Cotație {typeLabels[quote.type]}
          </p>
        </div>
        <span className={cn("flex items-center gap-1.5 text-sm font-medium", status.text)}>
          <span className={cn("h-2 w-2 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Details Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", type.iconBg)}>
                  <Shield className={cn("h-5 w-5", type.iconText)} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Detalii cotație</h3>
                  <p className="text-sm text-gray-400">Informații generale despre ofertă</p>
                </div>
              </div>

              {/* Premium - Hero Metric */}
              <div className={cn("flex items-center gap-4 rounded-xl p-4 border", type.badge.split(" ")[0], "border-transparent")}>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Banknote className={cn("h-5 w-5", type.iconText)} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Primă de asigurare</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">{formatCurrency(quote.premium)}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Building2 className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Asigurător</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{quote.insurerName}</p>
                  </div>
                </div>

                {quote.vehicleOrProperty && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                      <VehicleBrandLogo vehicleText={quote.vehicleOrProperty} size="md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Obiect asigurat</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{quote.vehicleOrProperty}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                    <CalendarRange className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Perioadă valabilitate</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {formatDate(quote.validFrom)} — {formatDate(quote.validUntil)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Data creare</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(quote.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Documente</CardTitle>
                <CardDescription>
                  Fișiere asociate acestei cotații
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <QuoteDocuments documents={quote.documents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
