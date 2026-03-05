import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

function calculateStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2)
    return { score: 1, label: "Slabă", color: "bg-red-500" };
  if (score <= 3)
    return { score: 2, label: "Acceptabilă", color: "bg-orange-500" };
  if (score <= 4)
    return { score: 3, label: "Bună", color: "bg-yellow-500" };
  return { score: 4, label: "Puternică", color: "bg-green-500" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { score, label, color } = calculateStrength(password);

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              level <= score ? color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Putere parolă: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
}
