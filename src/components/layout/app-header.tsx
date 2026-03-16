import { useTranslation } from 'react-i18next'
import { NotificationsSlideOver } from '@/components/notifications/notifications-slide-over'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useNotifications } from '@/hooks/use-notifications'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'nav.dashboard',
  '/quotes': 'nav.quotes',
  '/policies': 'nav.policies',
  '/profile': 'nav.profile',
  '/notifications': 'nav.notifications'
}

function getBreadcrumbs(pathname: string, t: (key: string, options?: Record<string, string>) => string) {
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
      crumbs.push({ label: t('nav.quoteDetail', { id: parts[1] }), href: pathname })
    } else if (parts[0] === 'policies') {
      crumbs.push({ label: t('nav.policyDetail', { id: parts[1] }), href: pathname })
    } else if (parts[0] === 'profile') {
      const subMap: Record<string, string> = {
        security: 'nav.security',
        settings: 'nav.settings'
      }
      if (subMap[parts[1]]) {
        crumbs.push({ label: t(subMap[parts[1]]), href: pathname })
      }
    }
  }

  return crumbs
}

export function AppHeader() {
  const { t } = useTranslation()
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname, t)
  const { data: notifications } = useNotifications()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
        <SidebarTrigger />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground"
          >
            {t('common.home')}
          </Link>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <span className="text-muted-foreground">/</span>
              <Link to={crumb.href} className="font-medium text-foreground">
                {crumb.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <NotificationsSlideOver
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </>
  )
}
