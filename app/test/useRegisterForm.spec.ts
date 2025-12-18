import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reactive, ref, computed } from 'vue';
import type { RegisterFormEmit } from '~/shared/types';

// Mock dependencies
const mockSignUp = vi.fn();
const mockClearMessages = vi.fn();
const mockNavigateTo = vi.fn();

vi.mock('#imports', () => ({
  useAuth: vi.fn(() => ({
    signUp: mockSignUp,
    loading: ref(false),
    error: ref(null),
    success: ref(null),
    clearMessages: mockClearMessages,
  })),
  navigateTo: mockNavigateTo,
  reactive,
  ref,
  computed,
}));

import { useRegisterForm } from '~/app/composables/useRegisterForm';

describe('useRegisterForm', () => {
  let emit: RegisterFormEmit;

  beforeEach(() => {
    vi.clearAllMocks();
    emit = vi.fn();
  });

  it('should fail validation for invalid email', async () => {
    const { handleSubmit } = useRegisterForm(emit, '/redirect');
    await handleSubmit();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('should call signUp and emit success on valid submission', async () => {
    const { form, handleSubmit } = useRegisterForm(emit, '/redirect-url');
    form.email = 'test@example.com';
    form.password = 'password123';
    form.confirmPassword = 'password123';
    form.firstName = 'Test';
    form.lastName = 'User';

    mockSignUp.mockResolvedValue({ success: true });

    await handleSubmit();

    expect(mockClearMessages).toHaveBeenCalled();
    expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', { firstName: 'Test', lastName: 'User' });
    expect(emit).toHaveBeenCalledWith('success');
    expect(mockNavigateTo).toHaveBeenCalledWith('/redirect-url');
  });

  it('should emit error on failed submission', async () => {
    const { form, handleSubmit } = useRegisterForm(emit, '/redirect');
    form.email = 'test@example.com';
    form.password = 'password123';
    form.confirmPassword = 'password123';

    const signUpError = new Error('Email already exists');
    mockSignUp.mockRejectedValue(signUpError);

    await handleSubmit();

    expect(emit).toHaveBeenCalledWith('error', 'Email already exists');
  });
});
