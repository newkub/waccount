import { defineEventHandler } from "h3";
import type { Invitation } from "../../../shared/types";

export default defineEventHandler(async (_event) => {
	// TODO: Replace with actual WorkOS invitation fetching logic
	const mockInvitations: Invitation[] = [
		{
			id: "inv_789",
			organizationName: "Marketing Team",
			role: "member",
			invitedBy: "john.doe@company.com",
			createdAt: "2024-03-10",
		},
	];

	return mockInvitations;
});
