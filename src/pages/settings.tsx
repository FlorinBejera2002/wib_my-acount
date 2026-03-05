import { NotificationSettings } from "@/components/settings/notification-settings";
import { PrivacySettings } from "@/components/settings/privacy-settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Setări</h1>
        <p className="text-sm text-gray-400">
          Configurează notificările și confidențialitatea contului
        </p>
      </div>

      <NotificationSettings />
      <PrivacySettings />
    </div>
  );
}
