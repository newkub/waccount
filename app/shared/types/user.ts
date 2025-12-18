import type { z } from 'zod';
import type { UserSchema, UpdateProfileDataSchema } from './schemas';

export type User = z.infer<typeof UserSchema>;
export type UserProfile = User;
export type UpdateProfileData = z.infer<typeof UpdateProfileDataSchema>;

export interface Activity {
  id: string;
  type: string;
  timestamp: string;
  [key: string]: unknown;
}
