import { defineEventHandler } from "h3";
import type { Provider } from "../../../shared/types";

export default defineEventHandler(async (_event) => {
	// TODO: Replace with actual provider data source
	const mockProviders: Provider[] = [
		{
			id: "microsoft",
			name: "Microsoft 365",
			type: "sso",
			description: "Connect with Microsoft Azure AD",
			icon: "mdi:microsoft",
			color: "blue",
		},
		{
			id: "slack",
			name: "Slack",
			type: "integration",
			description: "Connect your Slack workspace",
			icon: "mdi:slack",
			color: "purple",
		},
	];

	return mockProviders;
});
