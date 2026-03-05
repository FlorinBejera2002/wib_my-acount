import { useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { TwoFactorForm } from "@/components/auth/two-factor-form";
import { LoginProgress } from "@/components/auth/login-progress";
import { useLogin, useVerifyTwoFactor } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginFormValues } from "@/lib/validators";

type LoginStep = "credentials" | "two-factor" | "success";

export default function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [step, setStep] = useState<LoginStep>("credentials");
  const [tempToken, setTempToken] = useState("");

  const loginMutation = useLogin();
  const twoFactorMutation = useVerifyTwoFactor();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.requiresTwoFactor && response.tempToken) {
          setTempToken(response.tempToken);
          setStep("two-factor");
        }
      },
    });
  };

  const handleTwoFactor = (code: string) => {
    twoFactorMutation.mutate(
      { tempToken, code },
      {
        onSuccess: () => {
          setStep("success");
        },
      }
    );
  };

  const stepIndex =
    step === "credentials" ? 0 : step === "two-factor" ? 1 : 2;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            A
          </div>
          <h1 className="text-2xl font-bold text-foreground">asigurari.ro</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Autentifică-te în contul tău
          </p>
        </div>

        <LoginProgress currentStep={stepIndex} />

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            {step === "credentials" && (
              <>
                <CardTitle>Bine ai venit!</CardTitle>
                <CardDescription>
                  Introdu adresa de email și parola pentru a continua
                </CardDescription>
              </>
            )}
            {step === "two-factor" && (
              <>
                <CardTitle>Verificare în doi pași</CardTitle>
                <CardDescription>
                  Am trimis un cod de verificare pe adresa ta de email
                </CardDescription>
              </>
            )}
            {step === "success" && (
              <>
                <CardTitle>Autentificare reușită!</CardTitle>
                <CardDescription>
                  Vei fi redirecționat către panoul principal...
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {step === "credentials" && (
              <LoginForm
                onSubmit={handleLogin}
                isLoading={loginMutation.isPending}
              />
            )}

            {step === "two-factor" && (
              <TwoFactorForm
                onSubmit={handleTwoFactor}
                isLoading={twoFactorMutation.isPending}
              />
            )}

            {step === "success" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                <p className="text-sm text-muted-foreground">
                  Pregătim panoul tău de control...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © 2025 asigurari.ro — Toate drepturile rezervate
        </p>
      </div>
    </div>
  );
}
