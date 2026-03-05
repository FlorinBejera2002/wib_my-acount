import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useProfile, useUpdatePreferences } from "@/hooks/use-user";
import type { UpdatePreferencesRequest } from "@/api/types";

export function PreferencesForm() {
  const { data: profile, isLoading } = useProfile();
  const updatePreferences = useUpdatePreferences();

  const { control, handleSubmit, formState: { isDirty } } = useForm<UpdatePreferencesRequest>({
    values: profile
      ? {
          language: profile.preferences.language,
          timezone: profile.preferences.timezone,
          notifications: profile.preferences.notifications,
        }
      : undefined,
  });

  const onSubmit = (data: UpdatePreferencesRequest) => {
    updatePreferences.mutate(data);
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Preferințe</CardTitle>
        <CardDescription>
          Configurează limba, fusul orar și notificările
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Limbă</Label>
              <Controller
                control={control}
                name="language"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ro">Română</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Fus orar</Label>
              <Controller
                control={control}
                name="timezone"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Bucharest">
                        Europa/București (EET)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europa/Londra (GMT)
                      </SelectItem>
                      <SelectItem value="Europe/Berlin">
                        Europa/Berlin (CET)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Notificări email</h4>

            <div className="flex items-center justify-between">
              <div>
                <Label>Cotații noi</Label>
                <p className="text-sm text-muted-foreground">
                  Primește notificări când o cotație nouă este disponibilă
                </p>
              </div>
              <Controller
                control={control}
                name="notifications.quotes"
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
                  Primește alerte când o poliță urmează să expire
                </p>
              </div>
              <Controller
                control={control}
                name="notifications.policiesExpiry"
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
                  Primește oferte speciale și noutăți
                </p>
              </div>
              <Controller
                control={control}
                name="notifications.marketing"
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
                "Salvează preferințele"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
