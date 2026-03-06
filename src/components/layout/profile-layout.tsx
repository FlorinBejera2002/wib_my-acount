import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile, useUploadProfilePhoto } from '@/hooks/use-user'
import { cn, formatDate } from '@/lib/utils'
import { Camera, Loader2, Settings, Shield, User } from 'lucide-react'
import { useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { toast } from 'sonner'

const profileTabs = [
  { label: 'Informații personale', href: '/profile', icon: User, end: true },
  { label: 'Securitate', href: '/profile/security', icon: Shield },
  { label: 'Setări', href: '/profile/settings', icon: Settings }
]

export function ProfileLayout() {
  const { data: profile } = useProfile()
  const uploadPhoto = useUploadProfilePhoto()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fișierul trebuie să fie mai mic de 5MB')
      return
    }
    uploadPhoto.mutate(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Profile Hero Card */}
      <Card className="shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-accent-green/20 via-accent-green/10 to-transparent" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-5">
            {profile ? (
              <div className="relative group">
                <div className="rounded-full border-4 border-white shadow-sm">
                  <ProfileAvatar
                    firstName={profile.firstName}
                    lastName={profile.lastName}
                    photoUrl={profile.photoUrl}
                    size="lg"
                    userId={profile.id}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadPhoto.isPending}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer"
                >
                  {uploadPhoto.isPending ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <Skeleton className="h-24 w-24 rounded-full border-4 border-white" />
            )}
            <div className="pb-1 flex-1 min-w-0">
              {profile ? (
                <>
                  <h1 className="text-xl font-bold text-gray-900 truncate">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Client din {formatDate(profile.createdAt, 'MMMM yyyy')} -
                    ID: {profile.legacyCustomerId}
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation inside card */}
        <nav className="flex px-6 border-t border-gray-100">
          {profileTabs.map((tab) => (
            <NavLink
              key={tab.href}
              to={tab.href}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                  isActive
                    ? 'border-accent-green text-accent-green'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                )
              }
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </Card>

      {/* Tab Content */}
      <Outlet />
    </div>
  )
}
