import icon from '@/assets/Icon.svg'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

const pageTitleMap: Record<string, string> = {
  '/dashboard': 'nav.dashboard',
  '/quotes': 'nav.quotes',
  '/policies': 'nav.policies',
  '/profile': 'nav.profile',
  '/reminders': 'nav.expiryAlerts'
}

function getPageTitle(
  pathname: string,
  t: (key: string, options?: Record<string, string>) => string
) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return ''

  const firstPath = `/${parts[0]}`
  const labelKey = pageTitleMap[firstPath]
  return labelKey ? t(labelKey) : ''
}

function getBreadcrumbs(
  pathname: string,
  t: (key: string, options?: Record<string, string>) => string
) {
  const parts = pathname.split('/').filter(Boolean)
  const crumbs: Array<{ label: string; href: string }> = []

  if (parts.length === 0) return crumbs

  const firstPath = `/${parts[0]}`
  const labelKey = pageTitleMap[firstPath]
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
  const pageTitle = getPageTitle(location.pathname, t)
  const breadcrumbs = getBreadcrumbs(location.pathname, t)

  return (
    <header className="flex items-center border-b bg-card px-4 py-2 sm:py-4 lg:px-6">
      {/* Mobile: logo | centered title | hamburger */}
      <div className="flex w-full items-center md:hidden">
        <img src={icon} alt="asigurari.ro" className="h-9 w-9 shrink-0" />
        <span className="flex-1 text-center text-base font-semibold text-foreground truncate px-2">
          {pageTitle}
        </span>
        <SidebarTrigger />
      </div>

      {/* Desktop: breadcrumbs */}
      <nav className="hidden md:flex items-center gap-1.5 text-sm min-w-0 overflow-hidden">
        <Link
          to="/dashboard"
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          {t('common.home')}
        </Link>
        {breadcrumbs.map((crumb) => (
          <span
            key={crumb.href}
            className="flex items-center gap-1.5 min-w-0"
          >
            <span className="text-muted-foreground">/</span>
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
