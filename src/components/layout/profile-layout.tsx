import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/hooks/use-user'
import { cn, formatDate } from '@/lib/utils'
import { Shield, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'

const profileTabs = [
  {
    labelKey: 'profile.tabs.personal',
    href: '/profile',
    icon: User,
    end: true
  },
  {
    labelKey: 'profile.tabs.security',
    href: '/profile/security',
    icon: Shield
  }
]

export function ProfileLayout() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()
  return (
    <div className="space-y-6">
      {/* Profile Hero Card */}
      <Card className="shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-blue-900 to-blue-500 relative overflow-hidden" />
        <div className="relative px-4 sm:px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
            {profile ? (
              <div className="mx-auto sm:mx-0 rounded-full shadow-lg ring-4 ring-white shrink-0">
                <ProfileAvatar
                  firstName={profile.firstName ?? ''}
                  lastName={profile.lastName ?? ''}
                  photoUrl={undefined}
                  size="lg"
                  userId={profile.id}
                />
              </div>
            ) : (
              <Skeleton className="h-24 w-24 rounded-full mx-auto sm:mx-0 shrink-0" />
            )}
            <div className="pb-1 flex-1 min-w-0 text-center sm:text-left overflow-hidden">
              {profile ? (
                <div className="space-y-1">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 md:text-white truncate">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-sm text-gray-500 truncate">
                    {profile.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {t('profile.clientSince', {
                      date: formatDate(profile.createdAt, 'MMMM yyyy'),
                      id: profile.id
                    })}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
                  <Skeleton className="h-4 w-36 mx-auto sm:mx-0" />
                  <Skeleton className="h-3.5 w-44 mx-auto sm:mx-0" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation inside card */}
        <nav className="flex px-4 sm:px-6 border-t border-gray-100 overflow-x-auto hide-scrollbar">
          {profileTabs.map((tab) => (
            <NavLink
              key={tab.href}
              to={tab.href}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                )
              }
            >
              <tab.icon className="h-4 w-4" />
              {t(tab.labelKey)}
            </NavLink>
          ))}
        </nav>
      </Card>

      {/* Tab Content */}
      <Outlet />
    </div>
  )
}
