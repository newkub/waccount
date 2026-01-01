import { defineEventHandler } from "h3";
import type { Usage } from "../../../shared/types";

export default defineEventHandler(async (_event) => {
	// TODO: Replace with actual billing provider integration
	const mockUsage: Usage = {
		users: { current: 15, limit: "unlimited", percentage: 0 },
		api: { current: 45000, limit: 100000, percentage: 45 },
		storage: { current: 2.3, limit: 10, percentage: 23 },
		integrations: { current: 8, limit: "unlimited", percentage: 0 },
	};

	return mockUsage;
});
