import { vi } from "vitest";

vi.mock("nitropack/runtime", () => {
	return {
		useRuntimeConfig: () => ({
			workosApiKey: "sk_test_123",
			workosCookiePassword: "your-cookie-password-for-testing",
			public: {
				workosClientId: "client_test_123",
				baseUrl: "http://test.host",
			},
		}),
	};
});
