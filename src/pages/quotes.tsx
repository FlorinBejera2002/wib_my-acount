import { QuotesTable } from '@/components/quotes/quotes-table'
import { useTranslation } from 'react-i18next'

export default function QuotesPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t('quotes.title')}</h1>
        <p className="text-sm text-gray-400">
          {t('quotes.subtitle')}
        </p>
      </div>
      <QuotesTable />
    </div>
  )
}
