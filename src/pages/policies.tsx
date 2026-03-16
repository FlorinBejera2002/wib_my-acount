import { PoliciesTable } from '@/components/policies/policies-table'
import { useTranslation } from 'react-i18next'

export default function PoliciesPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t('policies.title')}</h1>
        <p className="text-sm text-gray-400">
          {t('policies.subtitle')}
        </p>
      </div>
      <PoliciesTable />
    </div>
  )
}
