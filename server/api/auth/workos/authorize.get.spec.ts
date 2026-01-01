import { describe, expect, it } from "vitest";

import { createTestEvent, mockWorkos } from "../../../test/setup";

describe("server/api/auth/workos/authorize.get", () => {
	it("returns authorizationUrl", async () => {
		mockWorkos.userManagement.getAuthorizationUrl.mockReturnValueOnce(
			"https://auth/url",
		);

		const handler = (await import("./authorize.get")).default;
		const event = createTestEvent();
		const res = await handler(event as any);
		expect(res).toEqual({ authorizationUrl: "https://auth/url" });
	});

});
