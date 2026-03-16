import type { MonthlyQuoteStat } from '@/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface ActivityChartProps {
  data: MonthlyQuoteStat[] | undefined
  isLoading: boolean
}

const monthKeys = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
] as const

export function ActivityChart({ data, isLoading }: ActivityChartProps) {
  const { t } = useTranslation()

  const formatMonthLabel = (month: string): string => {
    const monthNum = month.split('-')[1] ?? ''
    return monthKeys.includes(monthNum as (typeof monthKeys)[number])
      ? t(`dashboard.months.${monthNum}`)
      : monthNum
  }

  const quotesLabel = t('dashboard.quotes')

  const chartData = data?.map((item) => ({
    name: formatMonthLabel(item.month),
    [quotesLabel]: item.count
  }))

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
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7fc341" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7fc341" stopOpacity={0.02} />
                </linearGradient>
              </defs>
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
                labelFormatter={(label) => t('dashboard.month', { label })}
                formatter={(value: number) => [
                  t('dashboard.quotesCount', { count: value }),
                  t('dashboard.total')
                ]}
              />
              <Area
                type="monotone"
                dataKey={quotesLabel}
                stroke="#7fc341"
                strokeWidth={2.5}
                fill="url(#greenGradient)"
                dot={{
                  r: 4,
                  fill: '#ffffff',
                  stroke: '#7fc341',
                  strokeWidth: 2
                }}
                activeDot={{
                  r: 6,
                  fill: '#7fc341',
                  stroke: '#ffffff',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
