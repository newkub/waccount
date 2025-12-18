import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  emailVerified: z.boolean(),
  avatar: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UpdateProfileDataSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const LoginFormDataSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const RegisterFormDataSchema = LoginFormDataSchema.extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});
