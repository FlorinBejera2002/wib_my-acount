import icon from '@/assets/Icon.svg'
import logo from '@/assets/logo.svg'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'
import { useProfile } from '@/hooks/use-user'
import { useAuthStore } from '@/stores/auth-store'
import {
  ChevronsUpDown,
  ClipboardList,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  User
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  {
    labelKey: 'nav.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    labelKey: 'nav.quotes',
    href: '/quotes',
    icon: ClipboardList,
    countKey: 'totalQuotes'
  },
  {
    labelKey: 'nav.policies',
    href: '/policies',
    icon: FileText,
    countKey: 'activePolicies'
  },
  {
    labelKey: 'nav.expiryAlerts',
    href: '/reminders',
    icon: Clock
  }
]

export function AppSidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { data: stats } = useDashboardStats()
  const { data: profile } = useProfile()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-[0.600rem]">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center">
          <img
            src={logo}
            alt="asigurari.ro"
            className="h-9 w-6/7 group-data-[collapsible=icon]:hidden"
          />
          <img
            src={icon}
            alt="asigurari.ro"
            className="hidden h-9 w-9 shrink-0 group-data-[collapsible=icon]:block"
          />
        </div>
      </SidebarHeader>

      <Separator className="bg-gray-200 group-data-[collapsible=icon]:mx-2" />

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-2 overflow-auto hide-scrollbar pt-2">
        <SidebarGroup className="space-y-1 p-0">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-2 group-data-[collapsible=icon]:hidden">
            {t('nav.navigation')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href)
                const count =
                  item.countKey && stats
                    ? item.countKey === 'totalQuotes'
                      ? stats.quotes.total
                      : item.countKey === 'activePolicies'
                        ? stats.policies.active
                        : undefined
                    : undefined

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.href)}
                      tooltip={t(item.labelKey)}
                    >
                      <item.icon className="min-w-5 min-h-5 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                      <span className="flex-1 font-medium group-data-[collapsible=icon]:hidden">
                        {t(item.labelKey)}
                      </span>
                      {count !== undefined && (
                        <Badge className="ml-auto h-5 min-w-[20px] justify-center rounded-full bg-accent-green/15 px-1.5 text-[11px] font-semibold text-accent-green group-data-[collapsible=icon]:hidden">
                          {count}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <Separator className="mb-3 bg-gray-200" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild={true}>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 group-data-[collapsible=icon]:justify-center">
              <ProfileAvatar
                firstName={user?.firstName || ''}
                lastName={user?.lastName || ''}
                photoUrl={undefined}
                size="sm"
                userId={profile?.id}
              />
              <div className="flex flex-1 flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-semibold text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : ''}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-400 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : ''}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              {t('nav.myAccount')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail className="hover:after:bg-accent-green/30 after:transition-colors after:duration-200" />
    </Sidebar>
  )
}
