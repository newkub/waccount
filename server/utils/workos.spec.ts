import { describe, expect, it } from "vitest";

describe("server/utils/workos", () => {
	it("getWorkos returns instance using mocked WorkOS SDK", async () => {
		const { getWorkos } = await import("./workos");
		const w = getWorkos({
			workosApiKey: "api_key",
			workosClientId: "client_id",
		});
		expect(w).toBeDefined();
		expect((w as any).userManagement).toBeDefined();
	});
});
