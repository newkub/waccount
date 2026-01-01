import type { Invitation, UserOrganization as Organization } from "#shared/types";

export const useTeamsService = () => {
	const fetchTeamsData = async () => {
		const [{ data: organizations }, { data: invitations }] = await Promise.all([
			useFetch<Organization[]>("/api/users/me/organizations"),
			useFetch<Invitation[]>("/api/invitations"),
		]);

		return { organizations: organizations.value, invitations: invitations.value };
	};

	const acceptInvitation = async (invitationId: string) => {
		return useFetch(`/api/invitations/${invitationId}/accept`, {
			method: "POST",
		});
	};

	const declineInvitation = async (invitationId: string) => {
		return useFetch(`/api/invitations/${invitationId}/decline`, {
			method: "POST",
		});
	};

	const leaveOrganization = async (orgId: string) => {
		return $fetch(`/api/orgs/${orgId}/membership`, {
			method: "DELETE",
		} as any);
	};

	return {
		fetchTeamsData,
		acceptInvitation,
		declineInvitation,
		leaveOrganization,
	};
};
