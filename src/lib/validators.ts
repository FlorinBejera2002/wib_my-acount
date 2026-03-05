import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Adresa de email este obligatorie")
    .email("Adresa de email nu este validă"),
  password: z.string().min(1, "Parola este obligatorie"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, "Codul trebuie să aibă 6 cifre")
    .regex(/^\d{6}$/, "Codul trebuie să conțină doar cifre"),
});

export type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Parola actuală este obligatorie"),
    newPassword: z
      .string()
      .min(12, "Parola nouă trebuie să aibă cel puțin 12 caractere")
      .regex(/[A-Z]/, "Parola trebuie să conțină cel puțin o majusculă")
      .regex(/[a-z]/, "Parola trebuie să conțină cel puțin o minusculă")
      .regex(/[0-9]/, "Parola trebuie să conțină cel puțin o cifră")
      .regex(
        /[^A-Za-z0-9]/,
        "Parola trebuie să conțină cel puțin un caracter special"
      ),
    confirmPassword: z.string().min(1, "Confirmarea parolei este obligatorie"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parolele nu coincid",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Prenumele trebuie să aibă cel puțin 2 caractere")
    .max(50, "Prenumele nu poate depăși 50 de caractere"),
  lastName: z
    .string()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere")
    .max(50, "Numele nu poate depăși 50 de caractere"),
  phone: z
    .string()
    .regex(
      /^\+40[0-9]{9}$/,
      "Numărul de telefon trebuie să fie în format +40XXXXXXXXX"
    ),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const notificationSettingsSchema = z.object({
  quotes: z.boolean(),
  policiesExpiry: z.boolean(),
  marketing: z.boolean(),
});

export type NotificationSettingsFormValues = z.infer<
  typeof notificationSettingsSchema
>;

export const preferencesSchema = z.object({
  language: z.enum(["ro", "en"]),
  timezone: z.string().min(1, "Fusul orar este obligatoriu"),
});

export type PreferencesFormValues = z.infer<typeof preferencesSchema>;
