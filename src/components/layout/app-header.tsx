import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'nav.dashboard',
  '/quotes': 'nav.quotes',
  '/policies': 'nav.policies',
  '/profile': 'nav.profile'
}

function getBreadcrumbs(
  pathname: string,
  t: (key: string, options?: Record<string, string>) => string
) {
  const parts = pathname.split('/').filter(Boolean)
  const crumbs: Array<{ label: string; href: string }> = []

  if (parts.length === 0) return crumbs

  const firstPath = `/${parts[0]}`
  const labelKey = breadcrumbMap[firstPath]
  if (labelKey) {
    crumbs.push({ label: t(labelKey), href: firstPath })
  }

  if (parts.length > 1 && parts[1]) {
    if (parts[0] === 'quotes') {
      crumbs.push({
        label: t('nav.quoteDetail', { id: parts[1] }),
        href: pathname
      })
    } else if (parts[0] === 'policies') {
      crumbs.push({
        label: t('nav.policyDetail', { id: parts[1] }),
        href: pathname
      })
    } else if (parts[0] === 'profile') {
      const subMap: Record<string, string> = {
        security: 'nav.security',
        settings: 'nav.settings'
      }
      if (subMap[parts[1]]) {
        crumbs.push({ label: t(subMap[parts[1]]!), href: pathname })
      }
    }
  }

  return crumbs
}

export function AppHeader() {
  const { t } = useTranslation()
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname, t)

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
      <SidebarTrigger />

      <Separator orientation="vertical" className="h-6" />

      <nav className="flex items-center gap-1.5 text-sm min-w-0 overflow-hidden">
        <Link
          to="/dashboard"
          className="hidden sm:inline text-muted-foreground hover:text-foreground shrink-0"
        >
          {t('common.home')}
        </Link>
        {breadcrumbs.map((crumb) => (
          <span
            key={crumb.href}
            className="flex items-center gap-1.5 min-w-0"
          >
            <span className="hidden sm:inline text-muted-foreground">/</span>
            <Link
              to={crumb.href}
              className="font-medium text-foreground truncate"
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>
    </header>
  )
}
