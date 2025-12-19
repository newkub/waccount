import { describe, it, expect, vi } from 'vitest';
import { eventHandler } from 'h3';
import profileEventHandler from './profile.get';

describe('GET /api/auth/workos/profile', () => {
  it('should return 401 if user is not authenticated', async () => {
    const event = { context: {} } as any;

    await expect(profileEventHandler(event)).rejects.toThrowError();
  });

  it('should return user profile if authenticated', async () => {
    const mockUser = { id: 'user_123', email: 'test@example.com' };
    const event = { context: { user: mockUser } } as any;

    const result = await profileEventHandler(event);

    expect(result).toEqual({ profile: mockUser });
  });
});
