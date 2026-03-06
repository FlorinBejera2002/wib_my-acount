import { NotificationSettings } from '@/components/settings/notification-settings'
import { PrivacySettings } from '@/components/settings/privacy-settings'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <NotificationSettings />
      <PrivacySettings />
    </div>
  )
}
