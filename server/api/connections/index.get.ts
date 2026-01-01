import { defineEventHandler } from "h3";
import type { Connection } from "../../../shared/types";

export default defineEventHandler(async (_event) => {
	// TODO: Replace with actual WorkOS/provider integration
	const mockConnections: Connection[] = [
		{
			id: "conn_google_123",
			provider: "Google",
			type: "sso",
			status: "active",
			email: "user@example.com",
			connectedAt: "2024-01-15",
			lastUsed: "2024-03-20",
			permissions: ["email", "profile", "calendar"],
		},
		{
			id: "conn_slack_456",
			provider: "Slack",
			type: "integration",
			status: "active",
			email: "user@example.com",
			connectedAt: "2024-02-10",
			lastUsed: "2024-03-19",
			workspace: "wrikka-team",
			permissions: ["channels:read", "messages:write"],
		},
	];

	return mockConnections;
});
