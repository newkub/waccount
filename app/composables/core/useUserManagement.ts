import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores/user";

export const useUserManagement = () => {
	const userStore = useUserStore();

	const { user, loading, updating } = storeToRefs(userStore);

	return {
		user: readonly(user),
		loading: readonly(loading),
		updating: readonly(updating),
		fetchUserProfile: userStore.fetchUserProfile,
		updateUserProfile: userStore.updateUserProfile,
		uploadUserAvatar: userStore.uploadUserAvatar,
		deleteAccount: userStore.deleteAccount,
		getUserActivities: userStore.getUserActivities,
		updateEmail: userStore.updateEmail,
		resendVerificationEmail: userStore.resendVerificationEmail,
	};
};
