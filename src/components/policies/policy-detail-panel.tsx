import { Badge } from '@/components/ui/badge'
import { InsuranceTypeBadge } from '@/components/ui/insurance-type-badge'
import { Separator } from '@/components/ui/separator'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { usePolicy } from '@/hooks/use-policies'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  AlertCircle,
  ChevronRight,
  Download,
  FileText,
  Inbox,
  Layers,
  Users
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PolicyStatusBadge } from './policy-status-badge'

export function PolicyDetailPanel({
  policyId,
  travellerIndex,
  onSelectTraveller,
  componentIndex,
  onSelectComponent
}: {
  policyId: string
  travellerIndex?: number | null
  onSelectTraveller?: (idx: number) => void
  componentIndex?: number | null
  onSelectComponent?: (idx: number) => void
}) {
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

  /* ── Traveller-specific view ── */
  if (
    travellerIndex != null &&
    policy.travellers &&
    policy.travellers[travellerIndex]
  ) {
    const trav = policy.travellers[travellerIndex]
    const otherTravellers = policy.travellers
      .map((p, i) => ({ name: p.name, cnp: p.cnp, index: i }))
      .filter((_, i) => i !== travellerIndex)
    const premiumPerTraveller =
      policy.travellers.length > 0
        ? policy.premium / policy.travellers.length
        : 0

    return (
      <div className="space-y-5">
        {/* ── Header ── */}
        <SheetHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <PolicyStatusBadge status={policy.status} />
          </div>
          <SheetTitle className="text-base md:text-xl font-bold text-gray-900 leading-tight">
            <div className="flex items-center gap-2">{trav.name}</div>
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {policy.policyNumber} <span className="text-blue-800">•</span>{' '}
            <InsuranceTypeBadge type={policy.insuranceType ?? policy.type} />
          </p>
        </SheetHeader>
        <Separator />

        {/* ── Details List ── */}
        <div className="space-y-0">
          {/* Premium */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.insurancePremium')}
              </p>
              <p className="text-sm font-semibold text-green-600 truncate">
                {formatCurrency(premiumPerTraveller)}
              </p>
            </div>
          </div>

          {/* CNP */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.cnp')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {trav.cnp}
              </p>
            </div>
          </div>

          {/* Phone */}
          {trav.phone && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.phone')}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {trav.phone}
                </p>
              </div>
            </div>
          )}

          {/* Insurer */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.insurer')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {policy.insurerName ?? policy.insurer ?? '—'}
              </p>
            </div>
          </div>

          {/* Coverage Period */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.coveragePeriod')}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(policy.startDate)} — {formatDate(policy.endDate)}
              </p>
            </div>
          </div>

          {/* Days Until Expiry */}
          {policy.status === 'active' && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors">
              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.daysUntilExpiry')}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {t('policies.daysCount', { days: daysUntilExpiry })}
                  </p>
                  {daysUntilExpiry <= 7 && (
                    <Badge className="bg-red-100 text-red-700 border border-red-200 text-[10px] px-2 py-0.5 rounded">
                      {t('policies.expiresSoon')}
                    </Badge>
                  )}
                  {daysUntilExpiry > 7 && daysUntilExpiry <= 30 && (
                    <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded">
                      {t('policies.expiresSoon')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Covers */}
          {trav.covers && trav.covers.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors">
              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
                  {t('policies.covers')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {trav.covers.map((cover) => (
                    <Badge key={cover} variant="secondary" className="text-xs">
                      {cover}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Other travellers ── */}
        {otherTravellers.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('policies.otherTravellers')}
                </h3>
                <span
                  className={cn(
                    'pointer-events-none ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full text-[11px] text-center group-data-[collapsible=icon]:hidden border-gray-200 text-blue-800 font-normal shadow-[inset_0_1px_5px_0_rgba(0,0,0,0.1),inset_0_-1px_5px_0_rgba(0,0,0,0.1)]'
                  )}
                >
                  {otherTravellers.length}
                </span>
              </div>
              <div className="space-y-2">
                {otherTravellers.map((other) => (
                  <button
                    key={other.index}
                    type="button"
                    onClick={() => onSelectTraveller?.(other.index)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-50/70 hover:border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {other.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {other.cnp}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                ))}
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
          {trav.documents.length > 0 ? (
            <div className="space-y-2">
              {trav.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-blue-600 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  {doc.name}
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-6">
              <Inbox className="h-8 w-8 text-gray-300" />
              <p className="text-xs text-muted-foreground">
                {t('policies.noDocuments')}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── Component-specific view (PAD / Facultativă) ── */
  const resolvedComponents = policy.insuranceComponents && policy.insuranceComponents.length > 0
    ? policy.insuranceComponents
    : policy.insuranceType === 'pad_facultative'
      ? [
          { type: 'pad' as const, policyNumber: policy.policyNumber, insurerName: policy.insurerName ?? policy.insurer ?? '—', premium: policy.premium / 2, startDate: policy.startDate, endDate: policy.endDate, documents: [] as { id: string; name: string; type: string; url: string }[] },
          { type: 'facultative' as const, policyNumber: policy.policyNumber, insurerName: policy.insurerName ?? policy.insurer ?? '—', premium: policy.premium / 2, startDate: policy.startDate, endDate: policy.endDate, documents: [] as { id: string; name: string; type: string; url: string }[] }
        ]
      : null

  if (
    componentIndex != null &&
    resolvedComponents &&
    resolvedComponents[componentIndex]
  ) {
    const comp = resolvedComponents[componentIndex]
    const compDaysUntilExpiry = Math.ceil(
      (new Date(comp.endDate).getTime() - Date.now()) / 86400000
    )
    const otherComponents = resolvedComponents
      .map((c, i) => ({
        type: c.type,
        policyNumber: c.policyNumber,
        insurerName: c.insurerName,
        index: i
      }))
      .filter((_, i) => i !== componentIndex)

    return (
      <div className="space-y-5">
        {/* ── Header ── */}
        <SheetHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <PolicyStatusBadge status={policy.status} />
          </div>
          <SheetTitle className="text-base md:text-xl font-bold text-gray-900 leading-tight">
            <div className="flex md:items-center gap-2 flex-col md:flex-row items-start">
              {comp.policyNumber}{' '}
              <span className="text-blue-800 hidden md:flex">•</span>
              <InsuranceTypeBadge type={comp.type} />
            </div>
          </SheetTitle>
        </SheetHeader>
        <Separator />

        {/* ── Details List ── */}
        <div className="space-y-0">
          {/* Premium */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.insurancePremium')}
              </p>
              <p className="text-sm font-semibold text-green-600 truncate">
                {formatCurrency(comp.premium)}
              </p>
            </div>
          </div>

          {/* Insurer */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.insurer')}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {comp.insurerName}
              </p>
            </div>
          </div>

          {/* Coverage Period */}
          <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
            <div className="flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                {t('policies.coveragePeriod')}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(comp.startDate)} — {formatDate(comp.endDate)}
              </p>
            </div>
          </div>

          {/* Days Until Expiry */}
          {policy.status === 'active' && compDaysUntilExpiry >= 0 && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100">
              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.daysUntilExpiry')}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {t('policies.daysCount', { days: compDaysUntilExpiry })}
                  </p>
                  {compDaysUntilExpiry <= 7 && (
                    <Badge className="bg-red-100 text-red-700 border border-red-200 text-[10px] px-2 py-0.5 rounded">
                      {t('policies.expiresSoon')}
                    </Badge>
                  )}
                  {compDaysUntilExpiry > 7 && compDaysUntilExpiry <= 30 && (
                    <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded">
                      {t('policies.expiresSoon')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Insured Object (from parent policy) */}
          {(policy.policyDetails ?? policy.vehicleOrProperty) && (
            <div className="flex items-center gap-3 px-4 py-3 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.policyDetails')}
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {policy.policyDetails ?? policy.vehicleOrProperty}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Other component ── */}
        {otherComponents.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('policies.components')}
                </h3>
              </div>
              <div className="space-y-2">
                {otherComponents.map((other) => (
                  <button
                    key={other.index}
                    type="button"
                    onClick={() => onSelectComponent?.(other.index)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-100/70 hover:border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  >
                    <div className="flex-1 min-w-0">
                      <InsuranceTypeBadge type={other.type} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {other.insurerName} — {other.policyNumber}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
                  </button>
                ))}
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
          {comp.documents.length > 0 ? (
            <div className="space-y-2">
              {comp.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-blue-600 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  {doc.name}
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-6">
              <Inbox className="h-8 w-8 text-gray-300" />
              <p className="text-xs text-muted-foreground">
                {t('policies.noDocuments')}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <SheetHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <PolicyStatusBadge status={policy.status} />
        </div>
        <SheetTitle className="text-base md:text-xl font-bold text-gray-900 leading-tight">
          <div className="flex md:items-center gap-2 flex-col md:flex-row items-start">
            {policy.policyNumber}{' '}
            <span className="text-blue-800 hidden md:flex">•</span>
            <InsuranceTypeBadge type={policy.insuranceType ?? policy.type} />
          </div>
        </SheetTitle>
      </SheetHeader>
      <Separator />

      {/* ── Details List ── */}
      <div className="space-y-0">
        {/* Premium */}
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.insurancePremium')}
            </p>
            <p className="text-sm font-semibold text-green-600 truncate">
              {formatCurrency(policy.premium)}
            </p>
          </div>
        </div>

        {/* Insurer */}
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.insurer')}
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {policy.insurerName ?? policy.insurer ?? '—'}
            </p>
          </div>
        </div>

        {/* Coverage Period */}
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors border-b border-gray-100">
          <div className="flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              {t('policies.coveragePeriod')}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(policy.startDate)} — {formatDate(policy.endDate)}
            </p>
          </div>
        </div>

        {/* Days Until Expiry */}
        {policy.status === 'active' && (
          <>
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors border-b border-gray-100">
              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                  {t('policies.daysUntilExpiry')}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {t('policies.daysCount', { days: daysUntilExpiry })}
                  </p>
                  {daysUntilExpiry <= 7 && (
                    <Badge className="bg-red-100 text-red-700 border border-red-200 text-[10px] px-2 py-0.5 rounded">
                      {t('policies.expiresSoon')}
                    </Badge>
                  )}
                  {daysUntilExpiry > 7 && daysUntilExpiry <= 30 && (
                    <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded">
                      {t('policies.expiresSoon')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Policy Details / Vehicle */}
        {(policy.policyDetails ?? policy.vehicleOrProperty) && (
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
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
            <div className="space-y-2">
              {policy.travellers.map((trav, idx) => {
                return (
                  <button
                    key={`trav-${idx}`}
                    type="button"
                    onClick={() => onSelectTraveller?.(idx)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-100/70 hover:border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {trav.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {trav.cnp}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Insurance Components (PAD + Facultativă) ── */}
      {(() => {
        const components = policy.insuranceComponents && policy.insuranceComponents.length > 0
          ? policy.insuranceComponents
          : policy.insuranceType === 'pad_facultative'
            ? [
                { type: 'pad' as const, policyNumber: policy.policyNumber, insurerName: policy.insurerName ?? policy.insurer ?? '—', premium: policy.premium / 2, startDate: policy.startDate, endDate: policy.endDate, documents: [] },
                { type: 'facultative' as const, policyNumber: policy.policyNumber, insurerName: policy.insurerName ?? policy.insurer ?? '—', premium: policy.premium / 2, startDate: policy.startDate, endDate: policy.endDate, documents: [] }
              ]
            : null
        if (!components) return null
        return (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('policies.components')}
                </h3>
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] font-medium"
                >
                  {components.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {components.map((comp, idx) => (
                  <button
                    key={`comp-${idx}`}
                    type="button"
                    onClick={() => onSelectComponent?.(idx)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-100/70 hover:border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  >
                    <div className="flex-1 min-w-0">
                      <InsuranceTypeBadge type={comp.type} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {comp.insurerName} — {comp.policyNumber}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )
      })()}

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
