import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-3xl",
};

export function ProfileAvatar({
  firstName,
  lastName,
  size = "md",
}: ProfileAvatarProps) {
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
