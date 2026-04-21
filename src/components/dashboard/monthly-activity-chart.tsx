import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePolicies } from '@/hooks/use-policies'
import { useQuotes } from '@/hooks/use-quotes'
import { useMemo } from 'react'
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

function getLast6Months(): string[] {
  const months: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    months.push(`${y}-${m}`)
  }
  return months
}

function countByMonth(
  items: Array<{ createdAt: string }> | undefined
): Record<string, number> {
  const counts: Record<string, number> = {}
  if (!items) return counts
  for (const item of items) {
    const key = item.createdAt.slice(0, 7) // "2026-04"
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

export function MonthlyActivityChart() {
  const { t } = useTranslation()

  const { data: quotesData, isLoading: quotesLoading } = useQuotes({
    page: 1,
    limit: 100,
    sort: 'createdAt',
    order: 'desc'
  })

  const { data: policiesData, isLoading: policiesLoading } = usePolicies({
    page: 1,
    limit: 100,
    sort: 'createdAt',
    order: 'desc'
  })

  const isLoading = quotesLoading || policiesLoading

  const chartData = useMemo(() => {
    const months = getLast6Months()
    const quoteCounts = countByMonth(quotesData?.data)
    const policyCounts = countByMonth(policiesData?.data)

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
  }, [quotesData, policiesData, t])

  const quotesLabel = t('dashboard.recentQuotes')
  const policiesLabel = t('dashboard.recentPolicies')

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">
          {t('dashboard.activityTitle')}
          <span className="ml-2 text-xs font-normal text-gray-400">
            {t('dashboard.last6Months')}
          </span>
        </CardTitle>
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
                stroke="#f1f5f9"
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
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '13px',
                  padding: '8px 14px'
                }}
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
