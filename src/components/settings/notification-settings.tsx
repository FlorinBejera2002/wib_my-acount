import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useUpdatePreferences } from "@/hooks/use-user";
import type { NotificationPreferences } from "@/api/types";

export function NotificationSettings() {
  const { data: profile, isLoading } = useProfile();
  const updatePreferences = useUpdatePreferences();

  const { control, handleSubmit, formState: { isDirty } } =
    useForm<NotificationPreferences>({
      values: profile?.preferences.notifications,
    });

  const onSubmit = (data: NotificationPreferences) => {
    if (!profile) return;
    updatePreferences.mutate({
      language: profile.preferences.language,
      timezone: profile.preferences.timezone,
      notifications: data,
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
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
        <CardTitle>Notificări</CardTitle>
        <CardDescription>
          Alege ce notificări dorești să primești
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Cotații noi</Label>
                <p className="text-sm text-muted-foreground">
                  Notificări despre cotații noi și actualizări
                </p>
              </div>
              <Controller
                control={control}
                name="quotes"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Expirare polițe</Label>
                <p className="text-sm text-muted-foreground">
                  Alerte înainte de expirarea polițelor
                </p>
              </div>
              <Controller
                control={control}
                name="policiesExpiry"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Oferte speciale, promoții și noutăți
                </p>
              </div>
              <Controller
                control={control}
                name="marketing"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || updatePreferences.isPending}
            >
              {updatePreferences.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se salvează...
                </>
              ) : (
                "Salvează setările"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
