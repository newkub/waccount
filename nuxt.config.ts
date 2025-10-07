// https://nuxt.com/docs/api/configuration/nuxt-config
import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@vueuse/nuxt", "@unocss/nuxt", "@nuxtjs/color-mode", "@scalar/nuxt"],
	css: ["@unocss/reset/tailwind-compat.css"],
	nitro: {
		preset: 'cloudflare',
		experimental: {
			openAPI: true,
		},
	},
	// Scalar API Documentation (optional)
	// scalar: {
	// 	theme: 'nuxt',
	// 	url: 'https://registry.scalar.com/@scalar/apis/galaxy/latest?format=yaml',
	// },

	// Vite configuration
	vite: {
		plugins: [
			// Type checking with vue-tsc and biome
			checker({
				vueTsc: true,
				biome: {
					command: "check",
				},
				eslint: false, // ใช้ biome แทน eslint
			}),
		],
	},

});