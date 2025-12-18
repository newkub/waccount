import type { User, UpdateProfileData } from '~/shared/types';

export const useProfileForm = (user: Ref<User>, emit: (event: 'update-profile' | 'upload-avatar', ...args: any[]) => void) => {
    const form = reactive({
        firstName: user.value.firstName || '',
        lastName: user.value.lastName || '',
    });

    const isFormChanged = computed(() => {
        return (
            form.firstName !== (user.value.firstName || '') ||
            form.lastName !== (user.value.lastName || '')
        );
    });

    const handleSubmit = () => {
        if (isFormChanged.value) {
            const updateData: UpdateProfileData = {};
            if (form.firstName !== (user.value.firstName || '')) {
                updateData.firstName = form.firstName.trim();
            }
            if (form.lastName !== (user.value.lastName || '')) {
                updateData.lastName = form.lastName.trim();
            }
            emit('update-profile', updateData);
        }
    };

    watch(
        () => user.value,
        (newUser) => {
            form.firstName = newUser.firstName || '';
            form.lastName = newUser.lastName || '';
        },
        { deep: true }
    );

    return {
        form,
        isFormChanged,
        handleSubmit,
    };
};
