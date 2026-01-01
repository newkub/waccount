import type { Invitation, UserOrganization as Organization } from "~/shared/types";
import { computed, ref } from "vue";

export const useTeams = () => {
	const loading = ref(false);
	const organizations = ref<Organization[]>([]);
	const invitations = ref<Invitation[]>([]);

	const mockOrganizations: Organization[] = [
		{
			id: "org_123",
			name: "Wrikka Team",
			role: "admin",
			members: 5,
			createdAt: "2024-01-15",
			domain: "wrikka.com",
		},
		{
			id: "org_456",
			name: "Dev Team",
			role: "member",
			members: 12,
			createdAt: "2024-02-20",
			domain: "dev.local",
		},
	];

	const mockInvitations: Invitation[] = [
		{
			id: "inv_789",
			organizationName: "Marketing Team",
			role: "member",
			invitedBy: "john.doe@company.com",
			createdAt: "2024-03-10",
		},
	];

	const fetchTeamsData = async () => {
		loading.value = true;
		organizations.value = mockOrganizations;
		invitations.value = mockInvitations;
		loading.value = false;
	};

	const isOrganizationAdmin = computed(() => {
		return organizations.value.some(org => org.role === "admin");
	});

	const acceptInvitation = async (invitationId: string) => {
		loading.value = true;
		console.log("Accepting invitation:", invitationId);
		invitations.value = invitations.value.filter(inv => inv.id !== invitationId);
		loading.value = false;
	};

	const declineInvitation = async (invitationId: string) => {
		loading.value = true;
		console.log("Declining invitation:", invitationId);
		invitations.value = invitations.value.filter(inv => inv.id !== invitationId);
		loading.value = false;
	};

	const leaveOrganization = async (orgId: string) => {
		loading.value = true;
		console.log("Leaving organization:", orgId);
		organizations.value = organizations.value.filter(org => org.id !== orgId);
		loading.value = false;
	};

	return {
		loading,
		organizations,
		invitations,
		fetchTeamsData,
		isOrganizationAdmin,
		acceptInvitation,
		declineInvitation,
		leaveOrganization,
	};
};
