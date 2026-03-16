import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { VehicleBrandLogo } from '@/components/ui/vehicle-brand-logo'
import { usePolicy } from '@/hooks/use-policies'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarRange,
  Clock,
  FileText,
  RefreshCw,
  Shield
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PolicyDocuments } from './policy-documents'
import { PolicyStatusBadge } from './policy-status-badge'

const typeLabels: Record<string, string> = {
  RCA: 'RCA',
  CASCO: 'CASCO',
  CASCO_ECONOM: 'CASCO Econom',
  LOCUINTA_PAD: 'Locuință PAD',
  LOCUINTA_FACULTATIVA: 'Locuință Facultativă',
  CALATORIE: 'Călătorie',
  VIATA: 'Viață',
  ASISTENTA_RUTIERA: 'Asistență Rutieră',
  MALPRAXIS: 'Malpraxis',
  SANATATE: 'Sănătate',
  ACCIDENTE_CALATORI: 'Accidente Călători',
  ACCIDENTE_PERSOANE: 'Accidente Persoane',
  ACCIDENTE_TAXI: 'Accidente Taxi',
  CMR: 'CMR'
}

export function PolicyDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: policy, isLoading, isError } = usePolicy(id!)

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
    )
  }

  if (isError || !policy) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg font-medium">Polița nu a fost găsită</p>
        <Button asChild={true} variant="outline">
          <Link to="/policies">Înapoi la polițe</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild={true}>
          <Link to="/policies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              {policy.policyNumber}
            </h1>
            <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
              {typeLabels[policy.type]}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Poliță {typeLabels[policy.type]}
          </p>
        </div>
        <PolicyStatusBadge status={policy.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Details Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Detalii poliță
                  </h3>
                  <p className="text-sm text-gray-400">
                    Informații despre polița de asigurare
                  </p>
                </div>
              </div>

              {/* Premium - Hero Metric */}
              <div className="flex items-center gap-4 rounded-xl p-4 border border-transparent bg-green-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Banknote className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Primă de asigurare
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">
                    {formatCurrency(policy.premium)}
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Building2 className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asigurător
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                      {policy.insurerName}
                    </p>
                  </div>
                </div>

                {policy.vehicleOrProperty && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                      <VehicleBrandLogo
                        vehicleText={policy.vehicleOrProperty}
                        size="md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Obiect asigurat
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                        {policy.vehicleOrProperty}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dates & Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                    <CalendarRange className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perioadă acoperire
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {formatDate(policy.startDate)} —{' '}
                      {formatDate(policy.endDate)}
                    </p>
                  </div>
                </div>

                {policy.status === 'ACTIVE' && (
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                      <Clock className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zile până la expirare
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm font-semibold text-gray-900">
                          {policy.daysUntilExpiry} zile
                        </p>
                        {policy.daysUntilExpiry <= 30 && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 text-xs">
                            Expiră curând
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Source Quote Link */}
              {policy.sourceQuoteId && (
                <div className="p-4 rounded-lg bg-gray-50/50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Cotație sursă
                  </p>
                  <Link
                    to={`/quotes/${policy.sourceQuoteId}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Vezi cotația originală
                  </Link>
                </div>
              )}
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
                <CardTitle className="text-base font-semibold">
                  Documente
                </CardTitle>
                <CardDescription>
                  Fișiere asociate acestei polițe
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PolicyDocuments documents={policy.documents} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
