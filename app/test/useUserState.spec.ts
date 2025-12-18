import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import type { User } from '~/shared/types';

// This mock needs to be hoisted by Vitest before the `useUserState` import is processed.
vi.mock('#imports', () => {
  // Use a closure to maintain state across `useState` calls within a single test
  const state = new Map<string, any>();
  return {
    useState: vi.fn((key: string, init: () => any) => {
      if (!state.has(key)) {
        state.set(key, ref(init()));
      }
      return state.get(key);
    }),
    ref,
    computed,
  };
});

// Now that the mock is defined, we can import the composable.
// The import will use the mocked '#imports' module.
import { useUserState } from '~/app/composables/useUserState';

describe('useUserState', () => {
  beforeEach(() => {
    // Since we are mocking the module, we need to clear mocks to ensure test isolation.
    // We also need to reset any state if our mock implementation doesn't handle it.
    // In this case, the closure in the mock creates a fresh `state` map for each test run implicitly.
    vi.clearAllMocks();
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
