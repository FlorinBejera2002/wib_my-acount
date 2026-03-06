import { QuotesTable } from '@/components/quotes/quotes-table'

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Cotațiile Mele</h1>
        <p className="text-sm text-gray-400">
          Vezi și gestionează toate cotațiile tale de asigurare
        </p>
      </div>
      <QuotesTable />
    </div>
  )
}
