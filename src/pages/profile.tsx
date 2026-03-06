import { PreferencesForm } from '@/components/profile/preferences-form'
import { ProfileForm } from '@/components/profile/profile-form'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileForm />
      <PreferencesForm />
    </div>
  )
}
