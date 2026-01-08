import type { SlotVersion, SlotState } from "~/shared/types/slots";

export const useSlotVersioning = () => {
	const user = useUser();
	const projectContext = useProjectContext();
	const { $fetch } = useNuxtApp();

	const versions = ref<SlotVersion[]>([]);
	const currentVersion = ref<number>(0);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const createVersion = async (layoutId: string, slots: SlotState[]) => {
		if (!user.value?.id) return null;

		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotVersion>("/api/slots/versions", {
				method: "POST",
				body: {
					layoutId,
					userId: user.value.id,
					slots,
				},
			});
			versions.value.push(response);
			currentVersion.value = response.version;
			return response;
		} catch (e) {
			error.value = "Failed to create version";
			console.error(e);
			return null;
		} finally {
			isLoading.value = false;
		}
	};

	const fetchVersions = async (layoutId: string) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotVersion[]>("/api/slots/versions", {
				query: { layoutId },
			});
			versions.value = response;
			if (response.length > 0) {
				currentVersion.value = Math.max(...response.map((v) => v.version));
			}
		} catch (e) {
			error.value = "Failed to fetch versions";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const restoreVersion = async (versionId: string) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ slots: SlotState[] }>(`/api/slots/versions/${versionId}/restore`, {
				method: "POST",
			});
			return response.slots;
		} catch (e) {
			error.value = "Failed to restore version";
			console.error(e);
			return null;
		} finally {
			isLoading.value = false;
		}
	};

	const deleteVersion = async (versionId: string) => {
		isLoading.value = true;
		error.value = null;

		try {
			await $fetch(`/api/slots/versions/${versionId}`, { method: "DELETE" });
			versions.value = versions.value.filter((v) => v.id !== versionId);
			return true;
		} catch (e) {
			error.value = "Failed to delete version";
			console.error(e);
			return false;
		} finally {
			isLoading.value = false;
		}
	};

	const getVersionHistory = () => {
		return computed(() => {
			return [...versions.value].sort((a, b) => b.version - a.version);
		});
	};

	return {
		versions: readonly(versions),
		currentVersion: readonly(currentVersion),
		isLoading: readonly(isLoading),
		error: readonly(error),
		createVersion,
		fetchVersions,
		restoreVersion,
		deleteVersion,
		getVersionHistory,
	};
};
