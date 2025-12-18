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
