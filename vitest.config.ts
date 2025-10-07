import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
	plugins: [vue()],

	// Test configuration
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./app/test/setup.ts"],
		include: ["app/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		exclude: ["node_modules", "dist", ".nuxt", "app/dist"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: ["node_modules/", "app/test/", "**/*.d.ts", ".nuxt/", "dist/"],
		},
		testTimeout: 10000,
		hookTimeout: 10000,
	},

	// Resolve configuration
	resolve: {
		alias: {
			"@": resolve(__dirname, "./"),
			"~": resolve(__dirname, "./"),
			"#app": resolve(__dirname, "./.nuxt/app"),
			"#imports": resolve(__dirname, "./.nuxt/imports"),
		},
	},

	// Define global constants for testing
	define: {
		__VUE_OPTIONS_API__: true,
		__VUE_PROD_DEVTOOLS__: false,
	},
});
