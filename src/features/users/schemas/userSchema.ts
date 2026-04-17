import { z } from 'zod';

export const userSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  userName: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .regex(/^[a-z0-9._]+$/, 'Usa solo minúsculas, números, puntos o guiones bajos'),
  identification: z.string().min(6, 'La identificación debe tener al menos 6 caracteres'),
  email: z.string().email('Ingresa un correo válido'),
  role: z.enum(['Admin', 'Issuer', 'IssuerViewer']),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  isActive: z.boolean(),
});

export type UserFormValues = z.infer<typeof userSchema>;
