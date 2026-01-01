import { describe, expect, it } from "vitest";

import { createTestEvent } from "../../../../test/setup";

describe("server/api/auth/workos/profile/avatar.post", () => {
	it("throws 501 not supported", async () => {
		const handler = (await import("./avatar.post")).default;
		await expect(handler(createTestEvent() as any)).rejects.toMatchObject({
			statusCode: 501,
			message: "Avatar upload is not supported by AuthKit. Configure your own storage and update user metadata instead.",
		});
	});
});
