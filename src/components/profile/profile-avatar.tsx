import defaultAvatarSrc from '@/assets/default-avatar.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileAvatarProps {
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-16 w-16 text-xl',
  lg: 'h-24 w-24 text-3xl'
}

export function ProfileAvatar({
  firstName,
  lastName,
  size = 'md'
}: ProfileAvatarProps) {
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage
        src={defaultAvatarSrc}
        alt={`${firstName} ${lastName}`}
        className="scale-[1.6]"
      />
      <AvatarFallback className="bg-primary text-white font-semibold">
        {`${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
