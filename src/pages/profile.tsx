import { PreferencesForm } from '@/components/profile/preferences-form'
import { ProfileForm } from '@/components/profile/profile-form'

export default function ProfilePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <ProfileForm />
      <PreferencesForm />
    </div>
  )
}
