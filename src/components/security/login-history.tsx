import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { useProfile } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export function LoginHistory() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Informații securitate</CardTitle>
        <CardDescription>
          Detalii despre securitatea contului tău
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border p-4">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium">Ultima autentificare</p>
            <p className="text-sm text-muted-foreground">
              {profile?.security.lastLogin
                ? formatDateTime(profile.security.lastLogin)
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium">Parola schimbată</p>
            <p className="text-sm text-muted-foreground">
              {profile?.security.passwordChangedAt
                ? formatDateTime(profile.security.passwordChangedAt)
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-sm font-medium">Încercări eșuate de autentificare</p>
            <p className="text-sm text-muted-foreground">
              {profile?.security.failedAttempts ?? 0} încercări
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
