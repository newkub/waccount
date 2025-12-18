import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reactive, ref } from 'vue';
import { useLoginForm } from '~/app/composables/useLoginForm';

describe('useLoginForm', () => {
  const mockSignInWithPassword = vi.fn();
  const mockClearMessages = vi.fn();
  let emit: any;

  beforeEach(() => {
    vi.clearAllMocks();
    emit = vi.fn();

    // Mock the global useAuth provided by Nuxt
    vi.stubGlobal('useAuth', vi.fn(() => ({
      signInWithPassword: mockSignInWithPassword,
      loading: ref(false),
      error: ref(null),
      clearMessages: mockClearMessages,
    })));

    // Also stub other auto-imports if they are used directly in the composable
    vi.stubGlobal('reactive', reactive);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
