import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import { useUserState } from '~/app/composables/useUserState';
import type { User } from '~/app/shared/types';

// This is a more robust way to test composables that use Nuxt's auto-imports
// in a non-e2e (unit test) environment.
describe('useUserState', () => {
  let state: any;

  beforeEach(() => {
    // Create a fresh state for each test
    state = ref(null);

    // Mock the global useState provided by Nuxt
    vi.stubGlobal('useState', vi.fn((_key, init) => {
      if (state.value === null) {
        state.value = init ? init() : null;
      }
      return state;
    }));

    // Also stub other auto-imports if they are used directly in the composable
    vi.stubGlobal('ref', ref);
    vi.stubGlobal('computed', computed);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize with correct default values', () => {
    const { user, isAuthenticated, loading, error, success } = useUserState();

    expect(user.value).toBe(null);
    expect(isAuthenticated.value).toBe(false);
    expect(loading.value).toBe(false);
    expect(error.value).toBe(null);
    expect(success.value).toBe(null);
  });

  it('should set user and update isAuthenticated', () => {
    const { user, isAuthenticated, setUser } = useUserState();
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      avatar: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(mockUser);

    expect(user.value).toEqual(mockUser);
    expect(isAuthenticated.value).toBe(true);
  });

  it('should clear user and update isAuthenticated', () => {
    const { user, isAuthenticated, setUser } = useUserState();
    const mockUser: User = { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User', emailVerified: true, avatar: null, createdAt: '', updatedAt: '' };

    setUser(mockUser);
    expect(isAuthenticated.value).toBe(true);

    setUser(null);
    expect(user.value).toBe(null);
    expect(isAuthenticated.value).toBe(false);
  });

  it('should clear messages', () => {
    const { error, success, clearMessages } = useUserState();

    error.value = 'An error occurred';
    success.value = 'Operation was successful';

    clearMessages();

    expect(error.value).toBe(null);
    expect(success.value).toBe(null);
  });
});
