import type { LoginFormData } from '~/shared/types';

export const useLoginForm = (
    emit: (event: 'success' | 'error', ...args: any[]) => void
) => {
    const { signInWithPassword, loading, error, clearMessages } = useAuth();

    const form = reactive<LoginFormData>({
        email: '',
        password: '',
    });

    async function handleSubmit() {
        try {
            await signInWithPassword(form.email, form.password);
            emit('success');
        } catch (err: unknown) {
            // The error is already set in the useAuth composable
            emit('error', (err as Error)?.message || 'Login failed');
        }
    }

    return {
        form,
        loading,
        error,
        clearMessages,
        handleSubmit,
    };
};
