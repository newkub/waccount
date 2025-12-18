import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reactive, ref } from 'vue';

// Mock dependencies
const mockSignInWithPassword = vi.fn();
const mockClearMessages = vi.fn();

vi.mock('#imports', () => ({
  useAuth: vi.fn(() => ({
    signInWithPassword: mockSignInWithPassword,
    loading: ref(false),
    error: ref(null),
    clearMessages: mockClearMessages,
  })),
  reactive,
}));

import { useLoginForm } from '~/app/composables/useLoginForm';

describe('useLoginForm', () => {
  let emit: any;

  beforeEach(() => {
    vi.clearAllMocks();
    emit = vi.fn();
  });

  it('should initialize with an empty form', () => {
    const { form } = useLoginForm(emit);
    expect(form.email).toBe('');
    expect(form.password).toBe('');
  });

  it('should call signInWithPassword and emit success on valid submission', async () => {
    const { form, handleSubmit } = useLoginForm(emit);
    form.email = 'test@example.com';
    form.password = 'password123';

    mockSignInWithPassword.mockResolvedValue({});

    await handleSubmit();

    expect(mockSignInWithPassword).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(emit).toHaveBeenCalledWith('success');
    expect(emit).not.toHaveBeenCalledWith('error', expect.anything());
  });

  it('should emit an error on failed submission', async () => {
    const { form, handleSubmit } = useLoginForm(emit);
    form.email = 'test@example.com';
    form.password = 'wrong-password';

    const loginError = new Error('Invalid credentials');
    mockSignInWithPassword.mockRejectedValue(loginError);

    await handleSubmit();

    expect(mockSignInWithPassword).toHaveBeenCalledWith('test@example.com', 'wrong-password');
    expect(emit).toHaveBeenCalledWith('error', 'Invalid credentials');
    expect(emit).not.toHaveBeenCalledWith('success');
  });

  it('should call clearMessages from useAuth', () => {
    const { clearMessages } = useLoginForm(emit);
    
    clearMessages();

    expect(mockClearMessages).toHaveBeenCalled();
  });
});
