import type { ProjectContext } from "~/shared/types/slots";

export const useProjectContext = () => {
	const user = useUser();
	const { $fetch } = useNuxtApp();

	const currentContext = ref<ProjectContext | null>(null);
	const contexts = ref<ProjectContext[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const fetchContexts = async () => {
		if (!user.value?.id) return;

		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<ProjectContext[]>("/api/projects/contexts", {
				query: { userId: user.value.id },
			});
			contexts.value = response;
		} catch (e) {
			error.value = "Failed to fetch project contexts";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const createContext = async (data: Omit<ProjectContext, "id" | "createdAt" | "updatedAt">) => {
		if (!user.value?.id) return null;

		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<ProjectContext>("/api/projects/contexts", {
				method: "POST",
				body: { ...data, userId: user.value.id },
			});
			contexts.value.push(response);
			return response;
		} catch (e) {
			error.value = "Failed to create project context";
			console.error(e);
			return null;
		} finally {
			isLoading.value = false;
		}
	};

	const updateContext = async (id: string, updates: Partial<ProjectContext>) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<ProjectContext>(`/api/projects/contexts/${id}`, {
				method: "PUT",
				body: updates,
			});
			const index = contexts.value.findIndex((c) => c.id === id);
			if (index !== -1) {
				contexts.value[index] = response;
			}
			if (currentContext.value?.id === id) {
				currentContext.value = response;
			}
			return response;
		} catch (e) {
			error.value = "Failed to update project context";
			console.error(e);
			return null;
		} finally {
			isLoading.value = false;
		}
	};

	const deleteContext = async (id: string) => {
		isLoading.value = true;
		error.value = null;

		try {
			await $fetch(`/api/projects/contexts/${id}`, { method: "DELETE" });
			contexts.value = contexts.value.filter((c) => c.id !== id);
			if (currentContext.value?.id === id) {
				currentContext.value = null;
			}
			return true;
		} catch (e) {
			error.value = "Failed to delete project context";
			console.error(e);
			return false;
		} finally {
			isLoading.value = false;
		}
	};

	const switchContext = (context: ProjectContext | null) => {
		currentContext.value = context;
	};

	watch(user, () => {
		if (user.value?.id) {
			fetchContexts();
		}
	}, { immediate: true });

	return {
		currentContext: readonly(currentContext),
		contexts: readonly(contexts),
		isLoading: readonly(isLoading),
		error: readonly(error),
		fetchContexts,
		createContext,
		updateContext,
		deleteContext,
		switchContext,
	};
};
