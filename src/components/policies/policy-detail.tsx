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
import { usePolicy } from '@/hooks/use-policies'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarRange,
  Clock,
  FileText,
  Shield
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { PolicyStatusBadge } from './policy-status-badge'

export function PolicyDetail() {
  const { t } = useTranslation()
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
        <p className="text-lg font-medium">{t('policies.notFound')}</p>
        <Button asChild={true} variant="outline">
          <Link to="/policies">{t('policies.backToPolicies')}</Link>
        </Button>
      </div>
    )
  }

  const typeLabel = t(`insuranceType.${policy.type}`)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild={true}
          className="shrink-0 self-start"
        >
          <Link to="/policies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {policy.policyNumber}
            </h1>
            <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
              {typeLabel}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {t('policies.policyType', { type: typeLabel })}
          </p>
        </div>
        <PolicyStatusBadge status={policy.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Details Card */}
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {t('policies.detailsTitle')}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t('policies.detailsSubtitle')}
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
                    {t('policies.insurancePremium')}
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
                      {t('policies.insurer')}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                      {policy.insurer ?? '—'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Dates & Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                    <CalendarRange className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('policies.coveragePeriod')}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {formatDate(policy.startDate)} —{' '}
                      {formatDate(policy.endDate)}
                    </p>
                  </div>
                </div>

                {policy.status === 'active' && (() => {
                  const daysUntilExpiry = Math.ceil((new Date(policy.endDate).getTime() - Date.now()) / 86400000)
                  return (
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                        <Clock className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('policies.daysUntilExpiry')}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-sm font-semibold text-gray-900">
                            {t('policies.daysCount', {
                              days: daysUntilExpiry
                            })}
                          </p>
                          {daysUntilExpiry <= 30 && (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 text-xs">
                              {t('policies.expiresSoon')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Documents Card - placeholder */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {t('policies.documents')}
                </CardTitle>
                <CardDescription>
                  {t('policies.documentsSubtitle')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('policies.noDocuments')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
