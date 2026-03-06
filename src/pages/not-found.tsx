import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center bg-zinc-100">
      <div className="space-y-2">
        <h1 className="text-7xl font-bold text-gray-900">404</h1>
        <h2 className="text-xl font-semibold text-gray-900">
          Pagina nu a fost găsită
        </h2>
        <p className="text-gray-400">
          Pagina pe care o cauți nu există sau a fost mutată.
        </p>
      </div>
      <Button
        asChild={true}
        className="bg-accent-green hover:bg-accent-green-hover text-white"
      >
        <Link to="/dashboard">
          <Home className="mr-2 h-4 w-4" />
          Înapoi la pagina principală
        </Link>
      </Button>
    </div>
  )
}
