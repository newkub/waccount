import type { UpdateProfileData } from "#shared/types";

import type { Activity } from "#shared/types";
import { useUserManagement } from "~/composables/core/useUserManagement";
import { useAuth } from "~/composables/facade/useAuth";

export const useProfilePage = () => {
	const { user, refreshUser } = useAuth();
	const {
		updateUserProfile,
		uploadUserAvatar,
		getUserActivities,
		loading,
		resendVerificationEmail,
	} = useUserManagement();

	const form = reactive({
		firstName: user.value?.firstName ?? "",
		lastName: user.value?.lastName ?? "",
	});

	const isFormChanged = computed(() => {
		if (!user.value) return false;
		return (
			form.firstName !== (user.value.firstName || "")
			|| form.lastName !== (user.value.lastName || "")
		);
	});

	watch(
		user,
		(newUser) => {
			if (newUser) {
				form.firstName = newUser.firstName || "";
				form.lastName = newUser.lastName || "";
			}
		},
		{ deep: true },
	);

	const { data: activities, pending: activitiesLoading } = useAsyncData<Activity[]>(
		"user-activities",
		async () => {
			const res = await getUserActivities();
			return res?.activities ?? [];
		},
		{
			lazy: true,
		},
	);

	const handleSubmit = async () => {
		if (!user.value || !isFormChanged.value) return;

		const updateData: UpdateProfileData = {};
		if (form.firstName !== (user.value.firstName || "")) {
			updateData.firstName = form.firstName.trim();
		}
		if (form.lastName !== (user.value.lastName || "")) {
			updateData.lastName = form.lastName.trim();
		}

		if (Object.keys(updateData).length > 0) {
			await updateUserProfile(updateData);
			await refreshUser();
		}
	};

	const handleUploadAvatar = async (file: File) => {
		if (!user.value) return;
		await uploadUserAvatar(file);
		await refreshUser(); // Refresh main user state
	};

	const handleResendVerification = async () => {
		if (!user.value) return;
		await resendVerificationEmail();
	};

	return {
		user,
		activities,
		activitiesLoading,
		loading,
		form,
		isFormChanged,
		handleSubmit,
		handleUploadAvatar,
		handleResendVerification,
	};
};
