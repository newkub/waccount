import { describe, expect, it } from "vitest";

import { createTestEvent, mockWorkos } from "../../../../test/setup";

describe("server/api/auth/workos/authorize/[provider].get", () => {
	it("returns authorizationUrl for google", async () => {
		mockWorkos.userManagement.getAuthorizationUrl.mockReturnValueOnce("https://auth/url");

		const handler = (await import("./[provider].get")).default;
		const event = createTestEvent({
			context: { params: { provider: "google" } },
		});
		const res = await handler(event as any);
		expect(res).toEqual({ authorizationUrl: "https://auth/url" });
	});

	it("rejects unsupported provider", async () => {
		const handler = (await import("./[provider].get")).default;
		const event = createTestEvent({
			context: { params: { provider: "facebook" } },
		});
		await expect(handler(event as any)).rejects.toMatchObject({
			statusCode: 400,
		});
	});
});
