import icon from '@/assets/Icon.svg'
import logo from '@/assets/logo.svg'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar'
import { usePolicies } from '@/hooks/use-policies'
import { useQuotes } from '@/hooks/use-quotes'
import { useReminders } from '@/hooks/use-reminders'
import { useProfile } from '@/hooks/use-user'
import { cn } from '@/lib/utils'
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
    icon: Clock,
    countKey: 'upcomingReminders'
  }
]

export function AppSidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { isMobile, setOpenMobile } = useSidebar()

  // API calls separate pentru fiecare count
  const { data: quotesData } = useQuotes({ page: 1, limit: 1 })
  const { data: policiesData } = usePolicies({ page: 1, limit: 1 })
  const { data: remindersData } = useReminders()
  const { data: profile } = useProfile()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-100 bg-white">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-3">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center">
          <img
            src={logo}
            alt="asigurari.ro"
            className="h-5 w-auto group-data-[collapsible=icon]:hidden"
          />
          <img
            src={icon}
            alt="asigurari.ro"
            className="hidden h-9 w-9 shrink-0 group-data-[collapsible=icon]:block"
          />
        </div>
      </SidebarHeader>

      <div className="mx-4 h-px bg-gray-100 group-data-[collapsible=icon]:mx-2" />

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-2 overflow-auto hide-scrollbar pt-4">
        <SidebarGroup className="space-y-1 p-0">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-3 pb-2 group-data-[collapsible=icon]:hidden">
            {t('nav.navigation')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href)
                const count = item.countKey
                  ? item.countKey === 'totalQuotes'
                    ? quotesData?.total || 0
                    : item.countKey === 'activePolicies'
                      ? policiesData?.total || 0
                      : item.countKey === 'upcomingReminders'
                        ? remindersData?.length || 0
                        : undefined
                  : undefined

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => {
                        navigate(item.href)
                        if (isMobile) setOpenMobile(false)
                      }}
                      tooltip={t(item.labelKey)}
                      className={cn(
                        'rounded-lg transition-[background-color] duration-150',
                        isMobile
                          ? cn(
                              'h-12 !text-base',
                              isActive
                                ? 'bg-blue-50 text-blue-800 font-medium hover:bg-blue-50'
                                : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800'
                            )
                          : cn(
                              'h-10',
                              isActive
                                ? 'bg-gray-100 text-gray-900 font-medium hover:bg-gray-100'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            )
                      )}
                    >
                      <item.icon
                        className={cn(
                          'group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 transition-colors',
                          isMobile
                            ? 'min-w-6 min-h-6 text-blue-700'
                            : cn('min-w-5 min-h-5', isActive ? 'text-gray-700' : 'text-gray-400')
                        )}
                      />
                      <span className="flex-1 group-data-[collapsible=icon]:hidden">
                        {t(item.labelKey)}
                      </span>
                      {count !== undefined && (
                        <span
                          className={cn(
                            'pointer-events-none ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full text-[11px] text-center group-data-[collapsible=icon]:hidden',
                            isActive
                              ? 'border-gray-200 text-blue-800 font-normal shadow-[inset_0_1px_5px_0_rgba(0,0,0,0.1),inset_0_-1px_5px_0_rgba(0,0,0,0.1)]'
                              : 'border-gray-200 text-blue-800 font-normal shadow-[inset_0_1px_5px_0_rgba(0,0,0,0.1),inset_0_-1px_5px_0_rgba(0,0,0,0.1)]'
                          )}
                        >
                          {count}
                        </span>
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
        <div className="mx-1 mb-3 h-px bg-gray-100" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild={true}>
            <button className="flex w-full items-center gap-3 rounded-xl p-2.5 transition-all duration-150 hover:bg-gray-50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg">
              <ProfileAvatar
                firstName={
                  profile?.firstName ||
                  (user && 'firstName' in user ? user.firstName : '') ||
                  ''
                }
                lastName={
                  profile?.lastName ||
                  (user && 'lastName' in user ? user.lastName : '') ||
                  ''
                }
                photoUrl={undefined}
                size="sm"
                userId={profile?.id}
              />
              <div className="flex flex-1 flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-semibold text-gray-900">
                  {profile
                    ? `${profile.firstName} ${profile.lastName}`
                    : (user?.username ?? '')}
                </span>
                <span className="truncate text-xs text-gray-400">
                  {profile?.email || user?.email}
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-300 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-900">
                  {profile
                    ? `${profile.firstName} ${profile.lastName}`
                    : (user?.username ?? '')}
                </p>
                <p className="text-xs text-gray-500">
                  {profile?.email || user?.email}
                </p>
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

      <SidebarRail className="hover:after:bg-primary/20 after:transition-colors after:duration-200" />
    </Sidebar>
  )
}
