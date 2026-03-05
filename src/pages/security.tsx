import { ChangePasswordForm } from "@/components/security/change-password-form";
import { ActiveSessions } from "@/components/security/active-sessions";
import { LoginHistory } from "@/components/security/login-history";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Securitate</h1>
        <p className="text-sm text-muted-foreground">
          Gestionează parola și sesiunile contului tău
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ChangePasswordForm />
          <LoginHistory />
        </div>
        <ActiveSessions />
      </div>
    </div>
  );
}
