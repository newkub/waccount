// https://nuxt.com/docs/api/configuration/nuxt-config
import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: [
		"@vueuse/nuxt",
		"@unocss/nuxt",
		"@nuxtjs/color-mode",
	],
	nitro: {
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
		},
		experimental: {
			openAPI: true,
		},
	},
	vite: {
		plugins: [
			checker({
				vueTsc: true,
				/*
				biome: {
					command: "lint",
				},*/
			}),
		],
	},
});
