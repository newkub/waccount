import type { SlotTemplate } from "~/shared/types/slots";

export const useSlotTemplates = () => {
	const { $fetch } = useNuxtApp();

	const templates = ref<SlotTemplate[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const fetchTemplates = async (category?: string) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotTemplate[]>("/api/slots/templates", {
				query: category ? { category } : undefined,
			});
			templates.value = response;
		} catch (e) {
			error.value = "Failed to fetch templates";
			console.error(e);
		} finally {
			isLoading.value = false;
		}
	};

	const createTemplate = async (data: Omit<SlotTemplate, "id" | "createdAt" | "updatedAt">) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotTemplate>("/api/slots/templates", {
				method: "POST",
				body: data,
			});
			templates.value.push(response);
			return response;
		} catch (e) {
			error.value = "Failed to create template";
			console.error(e);
			return null;
		} finally {
			isLoading.value = false;
		}
	};

	const updateTemplate = async (id: string, updates: Partial<SlotTemplate>) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await $fetch<SlotTemplate>(`/api/slots/templates/${id}`, {
				method: "PUT",
				body: updates,
			});
			const index = templates.value.findIndex((t) => t.id === id);
			if (index !== -1) {
				templates.value[index] = response;
			}
			return response;
		} catch (e) {
			error.value = "Failed to update template";
			console.error(e);
			return null;
		} finally {
			isLoading.value = false;
		}
	};

	const deleteTemplate = async (id: string) => {
		isLoading.value = true;
		error.value = null;

		try {
			await $fetch(`/api/slots/templates/${id}`, { method: "DELETE" });
			templates.value = templates.value.filter((t) => t.id !== id);
			return true;
		} catch (e) {
			error.value = "Failed to delete template";
			console.error(e);
			return false;
		} finally {
			isLoading.value = false;
		}
	};

	const getTemplatesByCategory = (category: string) => {
		return computed(() => {
			return templates.value.filter((t) => t.category === category);
		});
	};

	const getDefaultTemplates = () => {
		return computed(() => {
			return templates.value.filter((t) => t.isDefault);
		});
	};

	onMounted(() => {
		fetchTemplates();
	});

	return {
		templates: readonly(templates),
		isLoading: readonly(isLoading),
		error: readonly(error),
		fetchTemplates,
		createTemplate,
		updateTemplate,
		deleteTemplate,
		getTemplatesByCategory,
		getDefaultTemplates,
	};
};
