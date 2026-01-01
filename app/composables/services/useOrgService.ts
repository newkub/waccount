import type { AccountOrganization, OrgDashboardLayoutResponse, User } from "#shared/types";

export const useOrgService = () => {
	const fetchDashboardLayout = (orgId: string) => {
		return useFetch<OrgDashboardLayoutResponse>(
			() => `/api/orgs/${orgId}/dashboard-layout`,
			{
				watch: [computed(() => orgId)],
			},
		);
	};

	const fetchOrganizations = () => {
		return useFetch<AccountOrganization[]>("/api/users/me/organizations");
	};

	const fetchMembers = (orgId: string) => {
		return useFetch<User[]>(`/api/orgs/${orgId}/members`);
	};

	return {
		fetchDashboardLayout,
		fetchOrganizations,
		fetchMembers,
	};
};
