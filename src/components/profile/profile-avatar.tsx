import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'

interface ProfileAvatarProps {
  firstName: string
  lastName: string
  photoUrl?: string
  size?: 'sm' | 'md' | 'lg'
  userId?: string // For localStorage key
}

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-16 w-16 text-xl',
  lg: 'h-24 w-24 text-3xl'
}

// Helper functions for localStorage
const getStoredAvatar = (userId: string): string | null => {
  try {
    return localStorage.getItem(`avatar_${userId}`)
  } catch {
    return null
  }
}

const storeAvatar = (userId: string, photoUrl: string): void => {
  try {
    localStorage.setItem(`avatar_${userId}`, photoUrl)
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function ProfileAvatar({
  firstName,
  lastName,
  photoUrl,
  size = 'md',
  userId
}: ProfileAvatarProps) {
  const [storedPhotoUrl, setStoredPhotoUrl] = useState<string | null>(null)
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

  useEffect(() => {
    if (userId) {
      // Try to get stored avatar first
      const stored = getStoredAvatar(userId)
      if (stored && !photoUrl) {
        setStoredPhotoUrl(stored)
      }

      // If we have a new photoUrl, store it
      if (photoUrl) {
        storeAvatar(userId, photoUrl)
        setStoredPhotoUrl(photoUrl)
      }
    }
  }, [photoUrl, userId])

  // Use stored photo if available, otherwise use prop
  const finalPhotoUrl = photoUrl || storedPhotoUrl

  return (
    <Avatar className={sizeClasses[size]}>
      {finalPhotoUrl && (
        <AvatarImage src={finalPhotoUrl} alt={`${firstName} ${lastName}`} />
      )}
      <AvatarFallback className="bg-accent-green text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
