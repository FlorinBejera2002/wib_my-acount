import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile, useUpdateProfile } from '@/hooks/use-user'
import {
  type UpdateProfileFormValues,
  updateProfileSchema
} from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone
        }
      : undefined
  })

  const onSubmit = (data: UpdateProfileFormValues) => {
    updateProfile.mutate(data)
  }

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
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Informații personale</CardTitle>
        <CardDescription>Actualizează-ți datele de contact</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenume</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nume</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresă de email</Label>
            <Input
              id="email"
              value={profile?.email ?? ''}
              disabled={true}
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Adresa de email nu poate fi modificată
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              placeholder="+40XXXXXXXXX"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se salvează...
                </>
              ) : (
                'Salvează modificările'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
