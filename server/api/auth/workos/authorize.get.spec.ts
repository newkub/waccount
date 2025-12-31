import { describe, expect, it } from "vitest";

import { createTestEvent, mockWorkos, setTestRuntimeConfig } from "../../../test/setup";

describe("server/api/auth/workos/authorize.get", () => {
	it("returns authorizationUrl", async () => {
		setTestRuntimeConfig({
			workosApiKey: "api_key",
			workosClientId: "client_id",
			workosCookiePassword: "cookie_password",
			workosRedirectUri: "https://example.com/callback",
		});
		mockWorkos.userManagement.getAuthorizationUrl.mockReturnValueOnce(
			"https://auth/url",
		);

		const handler = (await import("./authorize.get")).default;
		const event = createTestEvent();
		const res = await handler(event as any);
		expect(res).toEqual({ authorizationUrl: "https://auth/url" });
	});

	it("rejects when redirect uri missing", async () => {
		setTestRuntimeConfig({
			workosApiKey: "api_key",
			workosClientId: "client_id",
			workosCookiePassword: "cookie_password",
		});

		const handler = (await import("./authorize.get")).default;
		await expect(handler(createTestEvent() as any)).rejects.toMatchObject({
			statusCode: 500,
		});
	});
});
