import { vi } from "vitest";

type RuntimeConfig = Record<string, unknown>;

declare global {
	// biome-ignore lint/style/noVar: used for test-global runtimeConfig
	var __vitestRuntimeConfig: RuntimeConfig | undefined;
}

export const setTestRuntimeConfig = (cfg: RuntimeConfig) => {
	globalThis.__vitestRuntimeConfig = cfg;
};

vi.mock("nitropack/runtime", () => {
	return {
		useRuntimeConfig: () => globalThis.__vitestRuntimeConfig ?? {},
	};
});
