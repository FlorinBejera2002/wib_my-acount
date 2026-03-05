import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Car,
  Banknote,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PolicyStatusBadge } from "./policy-status-badge";
import { PolicyDocuments } from "./policy-documents";
import { usePolicy } from "@/hooks/use-policies";
import { formatCurrency, formatDate } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  RCA: "RCA",
  CASCO: "CASCO",
  LOCUINTA: "Locuință",
  CALATORIE: "Călătorie",
  VIATA: "Viață",
};

export function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: policy, isLoading, isError } = usePolicy(id!);

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

  if (isError || !policy) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg font-medium">Polița nu a fost găsită</p>
        <Button asChild variant="outline">
          <Link to="/policies">Înapoi la polițe</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/policies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{policy.policyNumber}</h1>
          <p className="text-sm text-gray-400">
            Poliță {typeLabels[policy.type]}
          </p>
        </div>
        <PolicyStatusBadge status={policy.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Detalii poliță</CardTitle>
            <CardDescription>
              Informații despre polița de asigurare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Asigurător</p>
                <p className="font-medium">{policy.insurerName}</p>
              </div>
            </div>

            {policy.vehicleOrProperty && (
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Obiect asigurat
                  </p>
                  <p className="font-medium">{policy.vehicleOrProperty}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prima de asigurare</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(policy.premium)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Perioadă acoperire</p>
                <p className="font-medium">
                  {formatDate(policy.startDate)} — {formatDate(policy.endDate)}
                </p>
              </div>
            </div>

            {policy.status === "ACTIVE" && (
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Zile până la expirare</p>
                  <p className="font-medium">
                    {policy.daysUntilExpiry} zile
                    {policy.daysUntilExpiry <= 30 && (
                      <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
                        Expiră curând
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Reînnoire automată</p>
                <p className="font-medium">
                  {policy.autoRenew ? "Da" : "Nu"}
                </p>
              </div>
            </div>

            {policy.sourceQuoteId && (
              <div>
                <p className="text-sm text-muted-foreground">Cotație sursă</p>
                <Link
                  to={`/quotes/${policy.sourceQuoteId}`}
                  className="text-sm text-primary hover:underline"
                >
                  Vezi cotația originală
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Documente</CardTitle>
            <CardDescription>Fișiere asociate acestei polițe</CardDescription>
          </CardHeader>
          <CardContent>
            <PolicyDocuments documents={policy.documents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
