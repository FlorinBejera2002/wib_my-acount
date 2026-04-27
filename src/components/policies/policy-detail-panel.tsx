import { Badge } from '@/components/ui/badge'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { Separator } from '@/components/ui/separator'
import {
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { usePolicy } from '@/hooks/use-policies'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  AlertCircle,
  Banknote,
  Building2,
  CalendarRange,
  Clock,
  Download,
  FileText,
  Inbox,
  Users
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PolicyStatusBadge } from './policy-status-badge'

export function PolicyDetailPanel({ policyId }: { policyId: string }) {
  const { t } = useTranslation()
  const { data: policy, isLoading, isError } = usePolicy(policyId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </SheetHeader>
        <Skeleton className="h-[72px] w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <Separator />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !policy) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-sm font-medium text-gray-900">{t('common.error')}</p>
        <p className="text-xs text-muted-foreground">
          {t('policies.notFound')}
        </p>
      </div>
    )
  }

  const daysUntilExpiry = Math.ceil(
    (new Date(policy.endDate).getTime() - Date.now()) / 86400000
  )

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <SheetHeader className="space-y-3 pb-5 border-b border-gray-100">
        <SheetTitle className="text-base font-bold text-gray-900 leading-tight">
          {policy.policyNumber}
        </SheetTitle>
        <div className="flex flex-wrap items-center gap-1.5">
          <InsuranceTypeBadge type={policy.insuranceType ?? policy.type} />
          <PolicyStatusBadge status={policy.status} />
        </div>
      </SheetHeader>

      {/* ── Premium Hero ── */}
      <div className="rounded-xl bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
            <Banknote className="h-5 w-5 text-accent-green" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
              {t('policies.insurancePremium')}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(policy.premium)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Details Grid ── */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-100">
        {/* Insurer */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              {t('policies.insurer')}
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {policy.insurerName ?? policy.insurer ?? '—'}
            </p>
          </div>
        </div>

        {/* Coverage Period */}
        <div className="flex items-center gap-3 px-4 py-3">
          <CalendarRange className="h-4 w-4 shrink-0 text-gray-400" />
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              {t('policies.coveragePeriod')}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(policy.startDate)} — {formatDate(policy.endDate)}
            </p>
          </div>
        </div>

        {/* Days Until Expiry */}
        {policy.status === 'active' && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Clock className="h-4 w-4 shrink-0 text-gray-400" />
            <div className="flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                {t('policies.daysUntilExpiry')}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {t('policies.daysCount', { days: daysUntilExpiry })}
                </p>
                {daysUntilExpiry <= 7 && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0 text-[10px] px-1.5 py-0">
                    {t('policies.expiresSoon')}
                  </Badge>
                )}
                {daysUntilExpiry > 7 && daysUntilExpiry <= 30 && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 text-[10px] px-1.5 py-0">
                    {t('policies.expiresSoon')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Policy Details / Vehicle */}
        {(policy.policyDetails ?? policy.vehicleOrProperty) && (
          <div className="flex items-center gap-3 px-4 py-3">
            <FileText className="h-4 w-4 shrink-0 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                {t('policies.policyDetails')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {policy.policyDetails ?? policy.vehicleOrProperty}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Travellers ── */}
      {policy.travellers && policy.travellers.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">
                {t('policies.travellers')}
              </h3>
              <Badge
                variant="outline"
                className="ml-auto text-[10px] font-medium"
              >
                {policy.travellers.length}
              </Badge>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-green-50">
                  <TableRow>
                    <TableHead className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      {t('policies.travellerName')}
                    </TableHead>
                    <TableHead className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      {t('policies.cnp')}
                    </TableHead>
                    <TableHead className="text-[11px] font-medium text-slate-500 uppercase tracking-wider text-right">
                      {t('policies.premium')}
                    </TableHead>
                    <TableHead className="text-[11px] font-medium text-slate-500 uppercase tracking-wider w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policy.travellers.map((trav, idx) => {
                    const doc = trav.documents[0]
                    const premiumPerTraveller =
                      policy.travellers!.length > 0
                        ? policy.premium / policy.travellers!.length
                        : 0
                    return (
                      <TableRow
                        key={`trav-${idx}`}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="text-sm font-medium text-gray-900 py-2">
                          {trav.name}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 font-mono py-2">
                          {trav.cnp}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-gray-900 text-right py-2">
                          {formatCurrency(premiumPerTraveller)}
                        </TableCell>
                        <TableCell className="py-2">
                          {doc ? (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                              title={doc.name}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* ── Documents ── */}
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">
            {t('policies.documents')}
          </h3>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-6">
          <Inbox className="h-8 w-8 text-gray-300" />
          <p className="text-xs text-muted-foreground">
            {t('policies.noDocuments')}
          </p>
        </div>
      </div>
    </div>
  )
}
