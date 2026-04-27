import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePolicies } from '@/hooks/use-policies'
import { useQuotes } from '@/hooks/use-quotes'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const monthKeys = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12'
] as const

type Period = 3 | 6 | 12 | 'all'

function getLastNMonths(n: number): string[] {
  const months: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    months.push(`${y}-${m}`)
  }
  return months
}

function collectAllMonths(
  items: Array<{ createdAt: string }> | undefined
): Set<string> {
  const set = new Set<string>()
  if (!items) return set
  for (const item of items) {
    set.add(item.createdAt.slice(0, 7))
  }
  return set
}

function countByMonth(
  items: Array<{ createdAt: string }> | undefined
): Record<string, number> {
  const counts: Record<string, number> = {}
  if (!items) return counts
  for (const item of items) {
    const key = item.createdAt.slice(0, 7)
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

const periodOptions: { value: Period; labelKey: string }[] = [
  { value: 3, labelKey: 'dashboard.period3m' },
  { value: 6, labelKey: 'dashboard.period6m' },
  { value: 12, labelKey: 'dashboard.period12m' },
  { value: 'all', labelKey: 'dashboard.periodAll' }
]

export function MonthlyActivityChart() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<Period>(6)

  const { data: quotesData, isLoading: quotesLoading } = useQuotes({
    page: 1,
    limit: 9999,
    sort: 'createdAt',
    order: 'desc'
  })

  const { data: policiesData, isLoading: policiesLoading } = usePolicies({
    page: 1,
    limit: 9999,
    sort: 'createdAt',
    order: 'desc'
  })

  const isLoading = quotesLoading || policiesLoading

  const chartData = useMemo(() => {
    const quoteCounts = countByMonth(quotesData?.data)
    const policyCounts = countByMonth(policiesData?.data)

    let months: string[]

    if (period === 'all') {
      const allKeys = new Set<string>()
      for (const k of collectAllMonths(quotesData?.data)) allKeys.add(k)
      for (const k of collectAllMonths(policiesData?.data)) allKeys.add(k)
      months = [...allKeys].sort()
      if (months.length === 0) months = getLastNMonths(6)
    } else {
      months = getLastNMonths(period)
    }

    return months.map((month) => {
      const monthNum = month.split('-')[1] ?? ''
      const label = monthKeys.includes(monthNum as (typeof monthKeys)[number])
        ? t(`dashboard.months.${monthNum}`)
        : monthNum
      return {
        name: label,
        quotes: quoteCounts[month] ?? 0,
        policies: policyCounts[month] ?? 0
      }
    })
  }, [quotesData, policiesData, t, period])

  const quotesLabel = t('dashboard.recentQuotes')
  const policiesLabel = t('dashboard.recentPolicies')

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold text-gray-900">
            {t('dashboard.activityTitle')}
          </CardTitle>
          <div className="flex items-center rounded-lg bg-gray-50/40 border border-gray-100/60 p-0.5">
            {periodOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPeriod(opt.value)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-md transition-all',
                  period === opt.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-500'
                )}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f8fafc"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  fontSize: '13px',
                  padding: '8px 14px'
                }}
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              />
              <Bar
                name={quotesLabel}
                dataKey="quotes"
                fill="#7fc341"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                name={policiesLabel}
                dataKey="policies"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
