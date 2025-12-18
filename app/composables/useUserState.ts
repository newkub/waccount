import type { User } from '~/shared/types';

export const useUserState = () => {
    const user = useState<User | null>('user', () => null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const success = ref<string | null>(null);

    const isAuthenticated = computed(() => !!user.value);

    const clearMessages = () => {
        error.value = null;
        success.value = null;
    };

    const setUser = (newUser: User | null) => {
        user.value = newUser;
    };

    return {
        user,
        loading,
        error,
        success,
        isAuthenticated,
        clearMessages,
        setUser,
    };
};
