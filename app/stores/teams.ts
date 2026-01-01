import type { Invitation, UserOrganization as Organization } from "#shared/types";
import { defineStore } from "pinia";

export const useTeamsStore = defineStore("teams", () => {
	const organizations = ref<Organization[]>([]);
	const invitations = ref<Invitation[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const isOrganizationAdmin = computed(() => {
		return organizations.value.some((org: Organization) => org.role === "admin");
	});

	return {
		organizations,
		invitations,
		loading,
		error,
		isOrganizationAdmin,
	};
});
