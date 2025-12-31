import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					name: "server",
					environment: "node",
					setupFiles: ["./server/test/setup.ts"],
					include: ["server/**/*.spec.ts"],
				},
			},
			defineVitestProject({
				test: {
					name: "nuxt",
					environment: "nuxt",
					include: ["app/**/*.spec.ts"],
					setupFiles: ["./app/test/setup.ts"],
				},
			}),
		],
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
		},
		typecheck: {
			checker: "lint",
		},
	},
});
