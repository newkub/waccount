import { storeToRefs } from "pinia";
import { useTeamsService } from "~/composables/services/useTeamsService";
import { useTeamsStore } from "~/stores/teams";

export const useTeamsFacade = () => {
	const teamsStore = useTeamsStore();
	const {
		organizations,
		invitations,
		loading,
		error,
		isOrganizationAdmin,
	} = storeToRefs(teamsStore);
	const service = useTeamsService();

	const fetchTeamsData = async () => {
		teamsStore.loading = true;
		teamsStore.error = null;
		try {
			const data = await service.fetchTeamsData();
			teamsStore.organizations = data.organizations ?? [];
			teamsStore.invitations = data.invitations ?? [];
		} catch (e: any) {
			teamsStore.error = e.message || "Failed to fetch teams data";
		} finally {
			teamsStore.loading = false;
		}
	};

	const acceptInvitation = async (invitationId: string) => {
		teamsStore.loading = true;
		teamsStore.error = null;
		try {
			await service.acceptInvitation(invitationId);
			teamsStore.invitations = teamsStore.invitations.filter(inv => inv.id !== invitationId);
		} catch (e: any) {
			teamsStore.error = e.message || "Failed to accept invitation";
		} finally {
			teamsStore.loading = false;
		}
	};

	const declineInvitation = async (invitationId: string) => {
		teamsStore.loading = true;
		teamsStore.error = null;
		try {
			await service.declineInvitation(invitationId);
			teamsStore.invitations = teamsStore.invitations.filter(inv => inv.id !== invitationId);
		} catch (e: any) {
			teamsStore.error = e.message || "Failed to decline invitation";
		} finally {
			teamsStore.loading = false;
		}
	};

	const leaveOrganization = async (orgId: string) => {
		teamsStore.loading = true;
		teamsStore.error = null;
		try {
			await service.leaveOrganization(orgId);
			teamsStore.organizations = teamsStore.organizations.filter(org => org.id !== orgId);
		} catch (e: any) {
			teamsStore.error = e.message || "Failed to leave organization";
		} finally {
			teamsStore.loading = false;
		}
	};

	return {
		// State from store
		organizations,
		invitations,
		loading,
		error,
		isOrganizationAdmin,

		// Actions
		fetchTeamsData,
		acceptInvitation,
		declineInvitation,
		leaveOrganization,
	};
};
