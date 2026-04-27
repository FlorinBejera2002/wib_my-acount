import type { TFunction } from 'i18next'
import { z } from 'zod'

export const loginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: z.string().min(1, t('validation.passwordRequired'))
  })

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>

export const twoFactorSchema = (t: TFunction) =>
  z.object({
    code: z
      .string()
      .length(6, t('validation.codeLength'))
      .regex(/^\d{6}$/, t('validation.codeDigitsOnly'))
  })

export type TwoFactorFormValues = z.infer<ReturnType<typeof twoFactorSchema>>

export const registerSchema = (t: TFunction) =>
  z
    .object({
      firstName: z
        .string()
        .min(2, t('validation.firstNameMin'))
        .max(50, t('validation.firstNameMax')),
      lastName: z
        .string()
        .min(2, t('validation.lastNameMin'))
        .max(50, t('validation.lastNameMax')),
      email: z
        .string()
        .min(1, t('validation.emailRequired'))
        .email(t('validation.emailInvalid')),
      phone: z.string().regex(/^\+40[0-9]{9}$/, t('validation.phoneFormat')),
      password: z
        .string()
        .min(12, t('validation.passwordMin'))
        .regex(/[A-Z]/, t('validation.passwordUppercase'))
        .regex(/[a-z]/, t('validation.passwordLowercase'))
        .regex(/[0-9]/, t('validation.passwordDigit'))
        .regex(/[^A-Za-z0-9]/, t('validation.passwordSpecial')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired'))
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['confirmPassword']
    })

export type RegisterFormValues = z.infer<ReturnType<typeof registerSchema>>

export const forgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid'))
  })

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>

export const resetPasswordSchema = (t: TFunction) =>
  z
    .object({
      newPassword: z
        .string()
        .min(12, t('validation.passwordMin'))
        .regex(/[A-Z]/, t('validation.passwordUppercase'))
        .regex(/[a-z]/, t('validation.passwordLowercase'))
        .regex(/[0-9]/, t('validation.passwordDigit'))
        .regex(/[^A-Za-z0-9]/, t('validation.passwordSpecial')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired'))
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['confirmPassword']
    })

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof resetPasswordSchema>
>

export const changePasswordSchema = (t: TFunction) =>
  z
    .object({
      oldPassword: z.string().min(1, t('validation.currentPasswordRequired')),
      newPassword: z
        .string()
        .min(12, t('validation.newPasswordMin'))
        .regex(/[A-Z]/, t('validation.passwordUppercase'))
        .regex(/[a-z]/, t('validation.passwordLowercase'))
        .regex(/[0-9]/, t('validation.passwordDigit'))
        .regex(/[^A-Za-z0-9]/, t('validation.passwordSpecial')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired'))
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['confirmPassword']
    })

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof changePasswordSchema>
>

export const updateProfileSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .min(2, t('validation.firstNameMin'))
      .max(50, t('validation.firstNameMax')),
    lastName: z
      .string()
      .min(2, t('validation.lastNameMin'))
      .max(50, t('validation.lastNameMax')),
    phone: z.string().regex(/^\+40[0-9]{9}$/, t('validation.phoneFormat'))
  })

export type UpdateProfileFormValues = z.infer<
  ReturnType<typeof updateProfileSchema>
>

export const notificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean()
})

export type NotificationSettingsFormValues = z.infer<
  typeof notificationSettingsSchema
>

export const preferencesSchema = z.object({
  language: z.enum(['ro', 'en', 'hu'])
})

export type PreferencesFormValues = z.infer<typeof preferencesSchema>

const NOTIFY_BEFORE_DAYS: Record<string, number> = {
  '1_DAY': 1,
  '3_DAYS': 3,
  '7_DAYS': 7,
  '1_MONTH': 30,
  '2_MONTHS': 60,
  '3_MONTHS': 90,
  '6_MONTHS': 180
}

export const createExpiryAlertSchema = (t: TFunction) =>
  z
    .object({
      alertType: z.enum(
        [
          'RCA',
          'ASR',
          'CALATORIE',
          'LOCUINTA_PAD',
          'LOCUINTA_OPTIONALA',
          'CASCO',
          'ROVINIETA',
          'ITP',
          'REVIZIE_AUTO',
          'PERMIS',
          'BULETIN',
          'PASAPORT',
          'ZIUA_SOTIEI'
        ],
        {
          required_error: t('validation.selectAlertType')
        }
      ),
      notifyBefore: z.enum(
        [
          '1_DAY',
          '3_DAYS',
          '7_DAYS',
          '1_MONTH',
          '2_MONTHS',
          '3_MONTHS',
          '6_MONTHS'
        ],
        {
          required_error: t('validation.selectNotifyInterval')
        }
      ),
      licensePlate: z.string().optional().or(z.literal('')),
      name: z.string().optional().or(z.literal('')),
      shortAddress: z.string().optional().or(z.literal('')),
      expiryDate: z.string().min(1, t('validation.expiryDateRequired'))
    })
    .superRefine((data, ctx) => {
      if (data.expiryDate && data.alertType !== 'ZIUA_SOTIEI') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const expiry = new Date(data.expiryDate)
        if (expiry <= today) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.expiryDateFuture'),
            path: ['expiryDate']
          })
          return
        }

        const daysUntilExpiry = Math.floor(
          (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
        const notifyDays = NOTIFY_BEFORE_DAYS[data.notifyBefore] ?? 0
        if (notifyDays >= daysUntilExpiry) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.notifyBeforeTooEarly'),
            path: ['notifyBefore']
          })
        }
      }
    })

export type CreateExpiryAlertFormValues = z.infer<
  ReturnType<typeof createExpiryAlertSchema>
>
