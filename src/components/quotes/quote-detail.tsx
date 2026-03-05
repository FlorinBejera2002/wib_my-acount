import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Building2, Car, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { QuoteStatusBadge } from "./quote-status-badge";
import { QuoteDocuments } from "./quote-documents";
import { useQuote } from "@/hooks/use-quotes";
import { formatCurrency, formatDate } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  RCA: "RCA",
  CASCO: "CASCO",
  LOCUINTA: "Locuință",
  CALATORIE: "Călătorie",
  VIATA: "Viață",
};

export function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: quote, isLoading, isError } = useQuote(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/quotes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{quote.quoteNumber}</h1>
          <p className="text-sm text-gray-400">
            Cotație {typeLabels[quote.type]}
          </p>
        </div>
        <QuoteStatusBadge status={quote.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Detalii cotație</CardTitle>
            <CardDescription>Informații generale despre ofertă</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Asigurător</p>
                <p className="font-medium">{quote.insurerName}</p>
              </div>
            </div>

            {quote.vehicleOrProperty && (
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Obiect asigurat
                  </p>
                  <p className="font-medium">{quote.vehicleOrProperty}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prima de asigurare</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(quote.premium)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Valabilitate</p>
                <p className="font-medium">
                  {formatDate(quote.validFrom)} — {formatDate(quote.validUntil)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Dată creare</p>
              <p className="text-sm">{formatDate(quote.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Documente</CardTitle>
            <CardDescription>
              Fișiere asociate acestei cotații
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuoteDocuments documents={quote.documents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
