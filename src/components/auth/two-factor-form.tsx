import { useRef, useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TwoFactorFormProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
}

const CODE_LENGTH = 6;
const RESEND_TIMER = 60;

export function TwoFactorForm({ onSubmit, isLoading }: TwoFactorFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmitCode = useCallback(
    (newDigits: string[]) => {
      const code = newDigits.join("");
      if (code.length === CODE_LENGTH && !isLoading) {
        onSubmit(code);
      }
    },
    [onSubmit, isLoading]
  );

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];

    if (value.length > 1) {
      // Handle paste
      const pastedDigits = value.slice(0, CODE_LENGTH).split("");
      pastedDigits.forEach((d, i) => {
        if (index + i < CODE_LENGTH) {
          newDigits[index + i] = d;
        }
      });
      setDigits(newDigits);

      const nextIndex = Math.min(index + pastedDigits.length, CODE_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();

      if (newDigits.every((d) => d !== "")) {
        handleSubmitCode(newDigits);
      }
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "")) {
      handleSubmitCode(newDigits);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setResendTimer(RESEND_TIMER);
    setDigits(Array(CODE_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Label className="text-gray-900">Cod de verificare</Label>
        <p className="text-sm text-gray-400">
          Introdu codul de 6 cifre trimis pe email
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={CODE_LENGTH}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-12 w-12 text-center text-lg font-semibold focus-visible:ring-accent-green"
            disabled={isLoading}
            aria-label={`Cifra ${index + 1}`}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin text-accent-green" />
          Se verifică codul...
        </div>
      )}

      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-gray-400">
            Retrimite cod în {formatTimer(resendTimer)}
          </p>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            className="text-accent-green hover:text-accent-green-hover hover:bg-accent-green/10"
          >
            Retrimite codul
          </Button>
        )}
      </div>
    </div>
  );
}
