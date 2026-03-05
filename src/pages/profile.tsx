import { useProfile } from "@/hooks/use-user";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileForm } from "@/components/profile/profile-form";
import { PreferencesForm } from "@/components/profile/preferences-form";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { data: profile } = useProfile();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {profile ? (
          <ProfileAvatar
            firstName={profile.firstName}
            lastName={profile.lastName}
            size="lg"
          />
        ) : (
          <Skeleton className="h-24 w-24 rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {profile
              ? `${profile.firstName} ${profile.lastName}`
              : ""}
          </h1>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
          {profile && (
            <p className="text-xs text-muted-foreground">
              Client din {formatDate(profile.createdAt, "MMMM yyyy")} · ID:{" "}
              {profile.legacyCustomerId}
            </p>
          )}
        </div>
      </div>

      <ProfileForm />
      <PreferencesForm />
    </div>
  );
}
