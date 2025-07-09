// lib/schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Vul je e-mailadres in' }) // 👈 afvangen van lege input
    .email({ message: 'Vul een geldig e-mailadres in' }),

  password: z
    .string()
    .min(1, { message: 'Vul je wachtwoord in' }) // 👈 eerst check op leegte
    .min(8, { message: 'Wachtwoord moet minimaal 8 tekens bevatten' })
    .regex(/[A-Z]/, { message: 'Minimaal één hoofdletter vereist' })
    .regex(/[0-9]/, { message: 'Minimaal één cijfer vereist' }),

  rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
