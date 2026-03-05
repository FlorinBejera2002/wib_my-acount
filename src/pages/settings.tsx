import { NotificationSettings } from "@/components/settings/notification-settings";
import { PrivacySettings } from "@/components/settings/privacy-settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Setări</h1>
        <p className="text-sm text-muted-foreground">
          Configurează notificările și confidențialitatea contului
        </p>
      </div>

      <NotificationSettings />
      <PrivacySettings />
    </div>
  );
}
