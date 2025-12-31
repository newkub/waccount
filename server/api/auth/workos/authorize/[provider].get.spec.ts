import { describe, expect, it } from "vitest";

import { createTestEvent, mockWorkos, setTestRuntimeConfig } from "../../../../test/setup";

const setCfg = () => {
	setTestRuntimeConfig({
		workosApiKey: "api_key",
		workosClientId: "client_id",
		workosCookiePassword: "cookie_password",
		workosRedirectUri: "https://example.com/callback",
	});
};

describe("server/api/auth/workos/authorize/[provider].get", () => {
	it("returns authorizationUrl for google", async () => {
		setCfg();
		mockWorkos.userManagement.getAuthorizationUrl.mockReturnValueOnce("https://auth/url");

		const handler = (await import("./[provider].get")).default;
		const event = createTestEvent({
			context: { params: { provider: "google" } },
		});
		const res = await handler(event as any);
		expect(res).toEqual({ authorizationUrl: "https://auth/url" });
	});

	it("rejects unsupported provider", async () => {
		setCfg();
		const handler = (await import("./[provider].get")).default;
		const event = createTestEvent({
			context: { params: { provider: "facebook" } },
		});
		await expect(handler(event as any)).rejects.toMatchObject({
			statusCode: 400,
		});
	});
});
